package exercises_java8.ex03;

import java.util.function.*;

public class TestFunctionalInterfaces {
    public static void main(String[] args) {
        Consumer<String> c = x1 -> System.out.println(x1);
        Predicate<Integer> p = i -> i < 100;
        Function<Double,Double> f = x -> Math.pow(x,3);
        Supplier<Exception> s = () -> new Exception();
        BiFunction<Double, Integer, Double> bf = (a, n) -> Math.pow(a, 1 / n);
        BiConsumer<String, String> bc = (s1,s2) -> System.out.println(s1 + " " + s2);
        UnaryOperator<Double> uo = x -> Math.sin(x);
        BinaryOperator<Double> bo = (x,y) -> x * y;
    }

    public static void demoMethodReferences(){
        Consumer<String> c = x1 -> System.out.println(x1);
        Consumer<String> cm = System.out::println;

        Predicate<Integer> p = i -> i < 100;
        Function<Double,Double> f = x -> Math.pow(x,3);


        Supplier<Exception> s = () -> new Exception();

        //BiFunction<Double, Integer, Double> bf = (a, n) -> Math.pow(a, n);
        BiFunction<Double, Integer, Double> bf = Math::pow;

        String michael = "Michael";
        Function<String, Integer> func0 = s1 -> s1.length();
        Function<String, Integer> func = String::length;
        Integer lengthMichael = func.apply(michael);

        BiConsumer<String, String> bc = (s1,s2) -> System.out.println(s1 + " " + s2);
        UnaryOperator<Double> uo = x -> Math.sin(x);
        BinaryOperator<Double> bo = (x,y) -> x * y;
    }
}
