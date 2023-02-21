package demos;

import java.util.function.*;

public class DemoFunctionalInterface {

    Consumer<String> c = s -> System.out.println(s);
    Predicate<Integer> p = i -> i < 100;
    Function<Double,Double> f = (x)->Math.pow(x,3);
    Supplier<Exception> s = ()-> new Exception();
    BiFunction<Double, Integer, Double> bf = (a,b)-> Math.pow(a, 1/b);
    BiConsumer<String, String> bc = (s,t) -> System.out.println(s + t);
    UnaryOperator<Double> uo = (x)-> Math.sin(x);
    BinaryOperator<Integer> bo = (s,t) -> s*t;

    public static  void demoMethodReferences() {
        Consumer<String> c = System.out::println;
        Predicate<Integer> p = i -> i < 100;
        Function<Double,Double> f = (x)->Math.pow(x,3);
        Supplier<Exception> s = Exception::new;
        BiFunction<Double, Integer, Double> bf = Math::pow;
        BiConsumer<String, String> bc = (a,b) -> System.out.println(a + b);
        UnaryOperator<Double> uo = Math::sin;
        BinaryOperator<Integer> bo = (x,t) -> x*t;
    }

    public static void main(String[] args) {

    }
}
