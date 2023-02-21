package exercises.ex03lombok;

import lombok.SneakyThrows;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j;

import java.time.LocalDate;

@Log
public class TestPerson {
    public static void main(String[] args) {
        Person p = new Person(1L, "michael", LocalDate.now(), 1.82, 82.7);
        System.out.println(p);
        log.info("Hallo Logging Welt");
        Person person = Person.builder()
                .name("Michael")
                .height(1.82)
                .weight(81.7)
                .build();
    }

    @SneakyThrows
    public static void m1(){
        if (true) throw new Exception();
    }
}
