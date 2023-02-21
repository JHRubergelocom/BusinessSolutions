package exercises.ex09_iostreams;


import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        PersonReaderWriter pwr = new PersonReaderWriter();

        Path path = Paths.get("persons.csv");
        pwr.writePersons(PersonFactory.createPersonList(100), path);
        List<Person> people = pwr.readPersons(path);
        people.forEach(System.out::println);
    }
}
