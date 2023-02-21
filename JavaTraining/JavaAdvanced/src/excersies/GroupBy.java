package excersies;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GroupBy {
    enum Groesse{KLEIN, MITTEL, GROSS};

    public static void main(String[] args) {
        Map<Groesse, List<Person>> persosenGruppen = PersonFactory.createPersonList(100)
                .stream()
                .sorted(Comparator.comparing(Person::getWeight))
                .collect(Collectors.groupingBy(p -> {
                    if (p.getHeight() < 1.6) return Groesse.KLEIN;
                    else if (p.getHeight() < 1.8) return Groesse.MITTEL;
                    else return Groesse.GROSS;
                }));

        persosenGruppen.entrySet()
                .stream()
                .forEach(entry -> System.out.println(entry));

    }
}
