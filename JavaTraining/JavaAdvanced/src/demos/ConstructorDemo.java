package demos;

public class ConstructorDemo {
    public ConstructorDemo() {
        System.out.println("Constructor Demo Constructor called");
    }

    public static void main(String[] args) {
        new Subclass();
    }
}

class Subclass extends ConstructorDemo {
    public Subclass () {
        System.out.println("Subclass Demo Constructor called");
    }
}
