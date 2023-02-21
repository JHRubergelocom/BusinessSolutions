package exercises.ex09_iostreams;

import lombok.extern.java.Log;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.stream.Stream;

@Log
public class PersonReaderWriter {
    public List<Person> readPersons(Path path) {
        List<Person> result = Collections.emptyList();
        try (Stream<String> lineStream = Files.lines(path)) {
            result = lineStream.map(line -> Person.fromCsvString(line))
                    .toList();
        } catch (Exception e) {
            log.log(Level.SEVERE, "Fehler beim Lesen", e);
        }
        return result;
    }

    public void writePersons(List<Person> persons, Path path) {
        try (BufferedWriter bufferedWriter = Files.newBufferedWriter(path)) {
           persons.stream()
                   .map(p -> p.toCsvString())
                   .forEach(p -> write(bufferedWriter, p));
        } catch (Exception e) {
            log.log(Level.SEVERE, "Fehler beim Schreiben", e);
        }
    }

    private static void write(BufferedWriter bufferedWriter, String p){
        try {
            bufferedWriter.write(p + "\n");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
