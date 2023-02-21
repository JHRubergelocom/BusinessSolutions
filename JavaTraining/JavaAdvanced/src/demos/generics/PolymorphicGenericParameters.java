package demos.generics;

import java.util.List;

public class PolymorphicGenericParameters {
    public static double sum(List<? extends Number> numberList) {
        double sum = 0;
        for (Number number:numberList) {
            sum += number.doubleValue();
        }
        return sum;
    }

    public static void main(String[] args) {
        List<Integer> intList = List.of(1,2,3);
        sum(intList);
    }
}
