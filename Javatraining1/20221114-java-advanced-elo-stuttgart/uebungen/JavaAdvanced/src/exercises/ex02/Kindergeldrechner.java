package exercises.ex02;

import java.util.Scanner;

public class Kindergeldrechner {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Anzahl Kinder:");
        int anzahlKinder = scanner.nextInt();

        double kindergeld = switch (anzahlKinder) {
            case 1 -> 500.;
            case 2 -> 1000.;
            default -> {
                if (anzahlKinder <= 0) {
                    yield 0.;
                } else {
                    yield 1000. + anzahlKinder * 300;
                }
            }
        };
        System.out.println("Du erhältst %.2f Euro Kindergeld.".formatted(kindergeld));
    }
}
