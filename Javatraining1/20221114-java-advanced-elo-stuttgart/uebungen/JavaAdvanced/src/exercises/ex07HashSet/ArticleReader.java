package exercises.ex07HashSet;

import lombok.SneakyThrows;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ArticleReader {
    public static void main(String[] args) {
        List<String> words = readFile(Paths.get("article.txt"));
        words.forEach(System.out::println);

    }

    @SneakyThrows
    public static List<String> readFile(Path path){
        try (Stream<String> lines = Files.lines(path)){
            return lines
                    .flatMap(s -> Stream.of(s.split(" ")))
                    .toList();
        }
    }
}
