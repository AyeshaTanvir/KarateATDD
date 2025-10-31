Feature: Test config

Scenario: Print baseUrl and Kafka config
  * print karate.pretty(baseUrl)
  * print karate.pretty(kafka)
  * print karate.pretty(kafka.broker)
  * eval karate.log('baseUrl:', baseUrl)
