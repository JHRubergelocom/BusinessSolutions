package exercises_java8.ex01;

@FunctionalInterface
public interface MyFunction {
    public abstract Integer apply(CalculatorEngine engine);
}
