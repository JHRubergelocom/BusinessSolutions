package demos;

public class DemoInnerclass {
    enum MyEnum { EINS, ZWEI}

    private int b;

    public class Inner {

    }

    public void m1(){
        int a = 5;
        class InnerLocal{
            public void m1(){
                System.out.println(a);
                b = 3;

            }
        }

        InnerLocal innerLocal = new InnerLocal();
    }

    public static void main(String[] args) {

    }
}
