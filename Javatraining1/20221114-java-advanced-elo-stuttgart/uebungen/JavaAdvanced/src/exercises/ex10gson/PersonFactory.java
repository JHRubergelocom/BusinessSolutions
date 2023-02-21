package exercises.ex10gson;

import net.datafaker.Faker;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

public class PersonFactory {
    public static List<Person> createPersonList(int number){
        Faker faker = new Faker();
        return IntStream.iterate(0, i -> i < number, i -> i + 1)
                .mapToObj(i -> new Person((long)i))
                .peek(p -> p.setName(faker.superhero().name()))
                .peek(p-> p.setBirthDate(faker.date().birthday().toLocalDateTime().toLocalDate()))
                .peek(p-> p.setHeight(ThreadLocalRandom.current().nextDouble(1.5, 2.0)))
                .peek(p -> p.setWeight(ThreadLocalRandom.current().nextDouble(60., 130.)))
                .peek(p -> p.setOrder(new Order(0L, LocalDate.now(), p)))
                .toList();
    }
}
