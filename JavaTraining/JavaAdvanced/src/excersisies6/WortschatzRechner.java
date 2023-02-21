package excersisies6;

import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.TreeSet;
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
        TreeSet<String> wortschatz = ArticleReader.readFile(Paths.get("article.txt"))
                .stream()
                .map(s -> s.replace(",", ""))
                .map(s -> s.replace(".", ""))
                .map(s -> s.trim())
                .map(s -> s.replace(":", ""))
                .map(s -> s.replace("\"", ""))
                .map(s -> s.toLowerCase())
                .filter(s -> !s.isBlank())
                .collect(Collectors.toCollection(() -> new TreeSet<String>(Comparator.reverseOrder())));

        System.out.println("Die Wörter sind:");
        wortschatz.forEach(System.out::println);
        System.out.println("Der Autor hat %d Wörter verwendet".formatted(wortschatz.size()));

    }
}
