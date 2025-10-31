function consumeMessage(config) {
  var Consumer = Java.type('org.apache.kafka.clients.consumer.KafkaConsumer');
  var Collection = Java.type('java.util.Collections');
  var Props = Java.type('java.util.Properties');
  var StringDeserializer = Java.type('org.apache.kafka.common.serialization.StringDeserializer');
  var Duration = Java.type('java.time.Duration');

  var props = new Props();
  props.put('bootstrap.servers', config.broker);
  props.put('group.id', 'karate-group-' + java.lang.System.currentTimeMillis());
  props.put('key.deserializer', StringDeserializer.class.getName());
  props.put('value.deserializer', StringDeserializer.class.getName());
  props.put('auto.offset.reset', 'latest');

  // 🔐 Bonus: Security for Kafka
  if (config.username) {
    props.put('security.protocol', 'SASL_SSL');
    props.put('sasl.mechanism', 'PLAIN');
    props.put('sasl.jaas.config',
      'org.apache.kafka.common.security.plain.PlainLoginModule required ' +
      'username="' + config.username + '" password="' + config.password + '";');
  }

  var consumer = new Consumer(props);
  consumer.subscribe(Collection.singletonList(config.topic));

  var message = null;
  var start = java.lang.System.currentTimeMillis();
  var timeoutMs = config.timeout || 5000;

  try {
    while ((java.lang.System.currentTimeMillis() - start) < timeoutMs) {
      var records = consumer.poll(Duration.ofMillis(1000));
      var iter = records.iterator();
      if (iter.hasNext()) {
        var rec = iter.next();
        message = rec.value();
        karate.log('✅ Received Kafka message:', message);
        break;
      }
    }
    if (message == null) karate.fail('Timeout waiting for Kafka message');
  } catch (e) {
    karate.log('❌ Kafka consumer failed:', e);
    karate.fail('Kafka consume failed: ' + e);
  } finally {
    consumer.close();
  }

  return { status: 'received', message: message };
}