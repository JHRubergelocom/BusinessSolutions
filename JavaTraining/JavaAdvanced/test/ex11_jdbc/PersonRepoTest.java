package ex11_jdbc;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PersonRepoTest {
    PersonRepo personRepo;

    @BeforeEach
    void beforeEach(){
        personRepo = new PersonRepo();
    }

    @Test
    void findAll() {
        Assertions.assertEquals(true,true);
    }

    @Test
    void findById() {
    }

    @Test
    void save() {
    }

    @Test
    void delete() {
    }
}