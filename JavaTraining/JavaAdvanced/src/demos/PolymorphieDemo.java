package demos;

import java.util.ArrayList;
import java.util.List;

public class PolymorphieDemo {
    public static void main(String[] args) {
        A a = new B();
        // B b = new A(); not allowed
        Object o = new C();

        List<B> bList = new ArrayList<>();
        // List<A> aList = bList; not allowed
        // aList.add(new C()); not allowed

    }
}

class A {

}

class B extends A {

}

class C extends A {

}