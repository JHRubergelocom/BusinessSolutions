package demos.generics;

import java.util.List;
import java.util.Optional;

public class GenericMethods {
    public static <T> Optional<T> getLastElement(List<T> list){
        if (list.isEmpty()) return Optional.empty();
        else return Optional.of(list.get(list.size() -1));
    }

    public static void main(String[] args) {
        List<String> aList = List.of("Eins", "Zwei", "Drei");
        Optional<String> lastElement = getLastElement(aList);

        List<Integer> integers = List.of(1, 2, 3);
        Optional<Integer> lastInt = getLastElement(integers);
    }

}
