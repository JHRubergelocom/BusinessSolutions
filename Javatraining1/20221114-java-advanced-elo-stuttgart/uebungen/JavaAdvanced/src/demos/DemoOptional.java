package demos;

import java.util.Optional;

public class DemoOptional {
    public static void main(String[] args) {
        Optional<String> stringOpt = Optional.of("String");
        Optional<String> s2Opt = Optional.empty();

        String nullOrNot = null;

        Optional<String> nullOrNotOpt = Optional.ofNullable(nullOrNot);

        if (nullOrNotOpt.isPresent()){
            String fromOpt = nullOrNotOpt.get();
            String fromOpt2 = nullOrNotOpt.orElseThrow();
        }

        String s = nullOrNotOpt.orElse("Default");


    }
}
