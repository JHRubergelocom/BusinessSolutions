package demos;

public class Initializers {

    {
        a = 4;
    }
    int a = 3;

    public static void main(String[] args) {
        Initializers i = new Initializers();
        System.out.println(i.a);
    }
}
