package examples.todos;

import com.intuit.karate.junit5.Karate;

class TodoRunner {

    @Karate.Test
    Karate testTodos() {
        return Karate.run("todo").relativeTo(getClass());
    }
}
