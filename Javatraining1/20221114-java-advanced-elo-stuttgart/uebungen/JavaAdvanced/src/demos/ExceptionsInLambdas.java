package demos;

import java.io.FileNotFoundException;
import java.io.FileReader;

public class ExceptionsInLambdas {
    public static void main(String[] args) {
        try {
            Runnable r = () -> {
                FileReader fr = getFileReader();
            };
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private static FileReader getFileReader() {
        try {
            return new FileReader("test.text");
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
