package exercises.ex01;

import java.util.Scanner;

public class AreaCalculation {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Radius=");
        double radius = scanner.nextDouble();
        double area = radius * radius * Math.PI;
        System.out.println("Die Kreisfläche ist: " + area);
    }
}
