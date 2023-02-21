package demos;

public class CalculatorEngine {

    public static void main(String[] args) {
        int ergebnis = CalculatorEngine.execute( e -> e.plus(1,1));
        System.out.println(ergebnis);
    }

    public static Integer execute (MyFunction function){
        return function.apply(new CalculatorEngine());
    }

    public int plus(int a, int b){
        return a+b;
    }

    public int minus(int a, int b){
        return a - b;
    }

    public int multipliedBy(int a, int b){
        return a * b;
    }

    public int devidedBy(int a,int b){
        return a/b;
    }

}
