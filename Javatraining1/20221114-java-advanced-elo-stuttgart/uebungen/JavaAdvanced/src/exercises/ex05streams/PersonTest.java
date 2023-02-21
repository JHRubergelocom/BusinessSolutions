package exercises.ex05streams;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class PersonTest {

    public static final String SCHWARZER_PETER = "Schwarzer Peter";

    public static void main(String[] args) {
        List<Person> personen = PersonFactory.createPersonList(100);
        List<Person> kleinePersonen = getKleinePersonenSortiert(personen);
        kleinePersonen.forEach(System.out::println);

        Predicate<Person> dieAlten = p -> p.getBirthDate().isBefore(LocalDate.of(2000, 1, 1));
        Predicate<Person> dieKLeinen = p -> p.getHeight() < 1.6;
        Predicate<Person> dieKleinenAlten = dieAlten.and(dieKLeinen);
        Predicate<Person> dieJungen = Predicate.not(dieAlten);
        Predicate<Person> dieGroßenJungen = dieJungen.and(dieKLeinen.negate());

        List<Person> personList = PersonFactory.createPersonList(1_000_000);
        personList.get(personList.size() / 2).setName(SCHWARZER_PETER);

        for (int i = 0; i < 4; i++) {
            long start = System.currentTimeMillis();
            Optional<Person> schwarzerPeterOpt = personList
                    .stream()
                    //.parallel()
                    .filter(p -> p.getName().equals(SCHWARZER_PETER))
                    .findAny();

            schwarzerPeterOpt.ifPresentOrElse(p -> System.out.println("Der schwarze Peter; " + p),
                    () -> System.out.println("Konnte den schwarzen Peter nicht finden."));
            long duration = System.currentTimeMillis() - start;
            System.out.println("Duration: " + duration + " ms");
        }
    }

    private static List<Person> getKleinePersonenSortiert(List<Person> personen) {
        return personen.parallelStream()
                .filter(p -> p.getHeight() <= 1.7)
                .sorted(Comparator.comparing(Person::getName).thenComparing(Person::getHeight))
                .collect(Collectors.toList());
    }
}
