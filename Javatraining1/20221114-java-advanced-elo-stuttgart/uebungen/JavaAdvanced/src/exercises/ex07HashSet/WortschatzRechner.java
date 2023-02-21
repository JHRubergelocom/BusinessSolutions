package exercises.ex07HashSet;

import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public class WortschatzRechner {
    public static void main(String[] args) {
        /*
         -Ermittle den Wortschatz des Artikels in article.txt
         -Elminiere alle Satzzeichen
         -wandle alle Wörter in Kleinschreibung
         -leerstrings eliminieren
         -verwende ein TreeSet um Duplikate zu eliminieren und die Wörter absteigend zu sortieren
         -gib aus, wieviele Wörter im Artikel vorkommen
         -gib die Liste der Wörter aus
         */

        List<String> woerter = ArticleReader.readFile(Paths.get("article.txt"));

        Set<String> wortschatz = woerter
                .stream()
                .map(s -> s.replace(",", ""))
                .map(s -> s.replace(".", ""))
                .map(s -> s.strip())
                .map(s -> s.replace(":", ""))
                .map(s -> s.replace("\"", ""))
                .map(s -> s.toLowerCase())
                .filter(s -> !s.isBlank())
                .collect(Collectors.toCollection(() -> Collections.synchronizedSet(new TreeSet<String>(Comparator.reverseOrder()))));

        System.out.println("Die Wörter sind: ");
        wortschatz.forEach(System.out::println);
        System.out.println("Der Autor hat %d Wörter verwendeet".formatted(wortschatz.size()));
    }
}
