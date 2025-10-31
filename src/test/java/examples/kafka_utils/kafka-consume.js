function consumeMessage(config) {
  karate.log('Consuming message from Kafka:', config.topic);
  if (config.mock) {
    var Paths = Java.type('java.nio.file.Paths');
    var Files = Java.type('java.nio.file.Files');
    var StandardCharsets = Java.type('java.nio.charset.StandardCharsets');
    var file = Paths.get('target', 'kafka-mock', config.topic + '.log');
    var keyFilter = (config.key == null) ? null : String(config.key);
    var message = null;
    if (Files.exists(file)) {
      var content = new java.lang.String(Files.readAllBytes(file), StandardCharsets.UTF_8);
      var lines = content.split("\\r?\\n");
      for (var i = lines.length - 1; i >= 0; i--) {
        var line = lines[i];
        if (!line) continue;
        var sep = line.indexOf('|');
        var key = sep >= 0 ? line.substring(0, sep) : '';
        var val = sep >= 0 ? line.substring(sep + 1) : line;
        if (keyFilter == null || key == keyFilter) {
          message = val;
          break;
        }
      }
    }
    if (message == null) karate.fail('Kafka mock message not found for topic: ' + config.topic + ' key: ' + keyFilter);
    return { status: 'received', message: message };
  }
    karate.fail('Real Kafka consume not configured in mock helper. Set -Dkafka.mock=true or implement real consumer.');
}