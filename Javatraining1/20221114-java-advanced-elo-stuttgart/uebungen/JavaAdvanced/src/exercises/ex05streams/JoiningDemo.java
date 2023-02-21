package exercises.ex05streams;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class JoiningDemo {
    public static void main(String[] args) {
        String result = String.join(", ", "eins", "zwei", "drei");
        System.out.println(result);

        String s2 = Stream.of("Eins", "Zwei", "Drei")
                .collect(Collectors.joining(", "));
        System.out.println(s2);


    }
}
