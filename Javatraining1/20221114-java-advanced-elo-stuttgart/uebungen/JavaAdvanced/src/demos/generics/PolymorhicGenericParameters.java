package demos.generics;

import java.util.List;

public class PolymorhicGenericParameters {
    public static double sum(List<? extends Number> numberList) {
        double sum = 0;
        for (Number number : numberList) {
            sum += number.doubleValue();
        }
        return sum;
    }

    public static void print(List<? super Number> aList){
        aList.add(Integer.valueOf(4));
        Object object = aList.get(0);
    }

    public static void main(String[] args) {
        List<Integer> intList = List.of(1,2,3);
        double sum = sum(intList);
    }

}
