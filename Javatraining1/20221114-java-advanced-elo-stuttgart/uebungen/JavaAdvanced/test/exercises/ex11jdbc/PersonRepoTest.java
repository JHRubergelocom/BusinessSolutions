package exercises.ex11jdbc;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class PersonRepoTest {
    PersonRepo personRepo;

    @BeforeEach
    void beforeEach(){
        personRepo = new PersonRepo();
    }

    @Test
    void findAll() {
        int initialNumberOfPersons = personRepo.findAll().size();
        List<Person> personsToBePersisted = PersonFactory.createPersonList(100);
        personsToBePersisted.forEach(p -> personRepo.save(p));
        int expectedNumberOfPersonsAfterInsert = 100 + initialNumberOfPersons;
        List<Person> personsAfterInsert = personRepo.findAll();
        Assertions.assertEquals(expectedNumberOfPersonsAfterInsert, personsAfterInsert.size());
        personsAfterInsert.forEach(p -> personRepo.delete(p.getId()));
    }

    @Test
    void findById() {
        Person person = PersonFactory.createPersonList(1).get(0);
        person = personRepo.save(person);
        assertNotNull(person.getId());
        Optional<Person> personFromDb = personRepo.findById(person.getId());
        assertTrue(personFromDb.isPresent());
        assertEquals(person, personFromDb.get());
        personRepo.delete(person.getId());
    }

    @Test
    void findByIdNotFound(){
        Optional<Person> byIdNotFound = personRepo.findById(Long.MAX_VALUE);
        assertTrue(byIdNotFound.isEmpty());
    }

    @Test
    void save() {
        List<Person> personList = PersonFactory.createPersonList(100);
        for (Person person:personList){
            person.setId(null);
            assertNull(person.getId());
            Person personAfterSave = personRepo.save(person);
            assertNotNull(personAfterSave.getId());
            person.setId(personAfterSave.getId());
            Optional<Person> personFoundInDb = personRepo.findById(personAfterSave.getId());
            assertEquals(person, personAfterSave);
            assertEquals(person, personFoundInDb.get());
            assertEquals(person.getHeight(), personFoundInDb.get().getHeight(), 0.01);
            assertEquals(person.getWeight(), personFoundInDb.get().getWeight(), 0.01);
            personRepo.delete(personFoundInDb.get().getId());
        }

    }

    @Test
    void delete() {
    }
}