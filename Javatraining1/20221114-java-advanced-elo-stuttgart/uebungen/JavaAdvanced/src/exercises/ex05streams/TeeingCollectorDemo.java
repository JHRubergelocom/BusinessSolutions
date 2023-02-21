package exercises.ex05streams;

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
                        (sum, n) -> sum / n));

        System.out.println("Average: " + average);

        OptionalDouble averageOpt = ThreadLocalRandom.current()
                .doubles(100)
                .average();
        averageOpt.ifPresent(System.out::println);
    }
}
