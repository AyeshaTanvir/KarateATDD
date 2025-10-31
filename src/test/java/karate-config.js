function fn() {
  var env = karate.env || 'dev';
  karate.log('Running in environment:', env);

  var config = {};

  if (env === 'dev') {
    config.baseUrl = 'https://jsonplaceholder.typicode.com';
    config.kafka = {
      broker: 'localhost:9092',
      topic: 'todo-dev-topic',
    };
  } else if (env === 'stage') {
    config.baseUrl = 'https://jsonplaceholder.typicode.com';
    config.kafka = {
      broker: 'stage.kafka:9093',
      topic: 'todo-stage-topic',
    };
  } else if (env === 'perf') {
    config.baseUrl = 'https://jsonplaceholder.typicode.com';
    config.kafka = {
      broker: 'perf.kafka:9094',
      topic: 'todo-perf-topic',
    };
  }
  else if (env === 'mtf') {
    config.baseUrl = 'https://jsonplaceholder.typicode.com';
    config.kafka = {
      broker: 'mtf.kafka:9094',
      topic: 'todo-mtf-topic',
    };
  }
    else {
    throw new Error('Unknown environment: ' + env);
  }
  config.kafka.username = karate.properties['kafka.user'];
  config.kafka.password = karate.properties['kafka.pass'];
  return config;
}