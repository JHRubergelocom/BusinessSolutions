package excersies;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class JoiningDemo {
    public static void main(String[] args) {
        String result = String.join(",", "eins", "zwei", "drei");
        System.out.println(result);

        String s2 = Stream.of("eins", "zwei", "drei")
                .collect(Collectors.joining(","));
        System.out.println(s2);

    }
}
