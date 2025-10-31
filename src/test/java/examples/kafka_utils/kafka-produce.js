function produceMessage(config) {
  karate.log('Producing message to Kafka:', config.topic);
  karate.log('Message:', config.message);
  // if Kafka client available, use real producer.
  // For now, write to mock file and return
  if (config.mock) {
    var Paths = Java.type('java.nio.file.Paths');
    var Files = Java.type('java.nio.file.Files');
    var StandardOpenOption = Java.type('java.nio.file.StandardOpenOption');
    var StandardCharsets = Java.type('java.nio.charset.StandardCharsets');
    var dir = Paths.get('target', 'kafka-mock');
    Files.createDirectories(dir);
    var file = dir.resolve(config.topic + '.log');
    var key = (config.key == null) ? '' : String(config.key);
    var msg = String(config.message);
    var line = key + '|' + msg + '\n';
    Files.write(file, line.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    return { status: 'mock-sent'};
  }
  return { status: 'sent'};
}