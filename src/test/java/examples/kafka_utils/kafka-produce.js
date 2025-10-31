function produceMessage(config) {
  var Producer = Java.type('org.apache.kafka.clients.producer.KafkaProducer');
  var Record = Java.type('org.apache.kafka.clients.producer.ProducerRecord');
  var Props = Java.type('java.util.Properties');
  var StringSerializer = Java.type('org.apache.kafka.common.serialization.StringSerializer');

  var props = new Props();
  props.put('bootstrap.servers', config.broker);
  props.put('key.serializer', StringSerializer.class.getName());
  props.put('value.serializer', StringSerializer.class.getName());
  props.put('acks', 'all');

  // 🔐 Bonus: Secure auth using credentials
  if (config.username) {
    props.put('security.protocol', 'SASL_SSL');
    props.put('sasl.mechanism', 'PLAIN');
    props.put('sasl.jaas.config',
      'org.apache.kafka.common.security.plain.PlainLoginModule required ' +
      'username="' + config.username + '" password="' + config.password + '";');
  }

  var producer = new Producer(props);
  var record = new Record(config.topic, config.key, config.message);

  try {
    var result = producer.send(record).get();
    karate.log('✅ Produced message to topic:', result.topic(), 'partition:', result.partition());
  } catch (e) {
    karate.log('❌ Kafka produce failed:', e);
    karate.fail('Kafka produce failed: ' + e);
  } finally {
    producer.close();
  }

  return { status: 'sent' };
}