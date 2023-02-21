package demos;

public class ConstructorDemo {
    public ConstructorDemo(int a) {
        super();
        System.out.println("Constructor Demo Constructor called");
    }
}

class Subclass extends ConstructorDemo{
    public Subclass() {
        this(1);
        System.out.println("Hallo");
    }

    public Subclass(int a) {
        super(a);
    }
}
