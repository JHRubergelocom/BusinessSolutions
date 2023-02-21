package demos;

import java.io.FileNotFoundException;
import java.io.FileReader;

public class ExecptionsInLambdas {
    public static void main(String[] args) {
        Runnable r = ()-> {
            try {
                FileReader fr = new FileReader("test.txt");
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        };
    }
}
