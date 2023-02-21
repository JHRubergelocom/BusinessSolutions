package demos;

import java.util.ArrayList;
import java.util.List;

public class PolymorhieDemo {
    public static void main(String[] args) {
        A a = new B();
        //B b = new A();
        Object o = new C();

        List<B> bList = new ArrayList<>();
        //List<A> aList = bList;
        // aList.add(new C());
    }
}

class A extends Object{
}

class B extends A{
}

class C extends A{
}
