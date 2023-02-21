package excersies;

import java.util.OptionalDouble;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class TeeingCollectorDemo {
    public static void main(String[] args) {
        Double average = ThreadLocalRandom.current()
                .doubles(100)
                .boxed()
                .collect(Collectors.teeing(Collectors.summingDouble(d -> d),
                        Collectors.counting(),
                        (sum, i) -> sum / i));

        System.out.println("Average: " + average);

        OptionalDouble average1 = ThreadLocalRandom.current()
                .doubles(100)
                .average();

        average1.ifPresent(System.out::println);

    }
}
