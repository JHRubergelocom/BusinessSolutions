package demos;

import java.util.Scanner;

public class ComputePI {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Value r");
        double r = sc.nextDouble();

        double a = r*r*Math.PI;
        System.out.println("Value a = " + a);
    }
}
