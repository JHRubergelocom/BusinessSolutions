package demos;

public class DemoInterfaces {
    public static void main(String[] args) {
        MyInterface.sm1();
    }
}

@FunctionalInterface
interface MyInterface {
    public static final int a = 10;

    public abstract void m1();

    public default void m2(){
        System.out.println("Meiner erste Default Methode");
        m3();
    }

    private void m3(){
        System.out.println("Nobody can call me, except default methods");
    }

    public static void sm1(){
        System.out.println("Hallo");
    }

    String toString();
}