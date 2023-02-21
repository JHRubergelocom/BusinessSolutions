package ex08_iostreams;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class PersonReaderWriter {
    public static void writePerson(Person person) {
        List<Person> persons = new ArrayList<>();
        persons.add(person);
        writePersons(persons);
    }

    public static void writePersons(List<Person> persons) {
        try (PrintWriter writer = new PrintWriter(new FileWriter("persons.csv"))) {
            for (Person person: persons) {
                writer.println(person.getId() + ";" + person.getName());
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static List<Person> readPersons() {
        List<Person> persons = new ArrayList<>();
        try (BufferedReader reader = Files.newBufferedReader(Paths.get("persons.csv"))) {
            String line = reader.readLine();
            while ( (line != null)) {
                String[] data = line.split(";");
                Person person = new Person();
                person.setId(Long.parseLong(data[0]));
                person.setName(data[1]);
                persons.add(person);
                line = reader.readLine();
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return persons;
    }

    public static void main(String[] args) {
        List<Person> persons = new ArrayList<>();
        Person person = new Person();
        person.setId(1L);
        person.setName("Maier");
        persons.add(person);

        person = new Person();
        person.setId(2L);
        person.setName("Schulze");
        persons.add(person);

        writePersons(persons);

        persons = readPersons();

        for(Person p: persons) {
            System.out.println("Person " + p);
        }
    }
}
