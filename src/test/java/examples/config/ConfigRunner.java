package examples.config;

import com.intuit.karate.junit5.Karate;

class ConfigRunner {

    @Karate.Test
    Karate testConfig() {
        return Karate.run("config-test").relativeTo(getClass());
    }

}