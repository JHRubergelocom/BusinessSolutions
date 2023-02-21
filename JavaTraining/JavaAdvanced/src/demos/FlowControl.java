package demos;

import java.util.Scanner;

public class FlowControl {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Value r");
        int kinder = sc.nextInt();

        double k = switch (kinder) {
            case 0 -> 0.;
            case 1 -> 500.;
            case 2 -> 1000.;
            default -> {
                yield 1000. + kinder * 300;
            }
        };
        System.out.println(k);
    }
}
