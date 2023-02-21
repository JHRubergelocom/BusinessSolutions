package demos;

public class DemoInterface {

}

// Bis Java 7
@FunctionalInterface
interface MyInterfaceJava7 {
    public static final int a = 10;

    public abstract void m1();

    String toString();
}

// Ab Java 8
@FunctionalInterface
interface MyInterfaceJava8 {
    public static final int a = 10;

    public abstract void m1();

    public default  void m2() {
        System.out.println("Meine erste Default Methode");
    }

    public static void sm1(){
        System.out.println("Hallo");
    }

    String toString();
}

// Ab Java 11
@FunctionalInterface
interface MyInterfaceJava11 {
    public static final int a = 10;

    public abstract void m1();

    public default  void m2() {
        System.out.println("Meine erste Default Methode");
        m3();
        this.toString();
    }

    public static void sm1(){
        System.out.println("Hallo");
    }

    private void m3(){
        System.out.println("Nobody can call me, except default methods");
    }

    String toString();
}
