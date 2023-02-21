package demos;

import lombok.extern.java.Log;

import java.time.LocalDate;

@Log
public class TestPerson {
    public static void main(String[] args) {
        Person p = new Person(1L, "Jan", LocalDate.now(), 177, 100);
        log.info("Hallo Logging Welt!");
    }
}
