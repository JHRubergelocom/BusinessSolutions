package demos;

import java.util.Optional;

public class DemoOptional {

    public static void main(String[] args) {
        Optional<String> stringOpt = Optional.of("String");
        Optional<String> s20pt = Optional.empty();

        String nullOrNot = null;
        Optional<String> nullOrNotOpt = Optional.ofNullable(nullOrNot);

        if (nullOrNotOpt.isPresent()){
            String fromOtp = nullOrNotOpt.get();
            String fromOpt2 = nullOrNotOpt.orElseThrow();
        }

    }
}
