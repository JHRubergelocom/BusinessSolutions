package excersies;

public class ReduceDemo {
    public static void main(String[] args) {
        Double gesamtGewicht = PersonFactory.createPersonList(100)
                .stream()
                .map(p -> p.getWeight())
                .reduce(0., (zwischensummme, element) -> zwischensummme + element);
        System.out.println("Gesamtgewicht " + gesamtGewicht);
    }
}
