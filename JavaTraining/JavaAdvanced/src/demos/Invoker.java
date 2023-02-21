package demos;


public class Invoker {
    public static void main(String[] args) {
        Programm programm = new Programm();
        programm.add(()->System.out.println("Hello"))
                .add(()-> {
                    System.out.println("This example does not really make sense.");
                    System.out.println("But it works");
                })
                .execute();
    }
}
