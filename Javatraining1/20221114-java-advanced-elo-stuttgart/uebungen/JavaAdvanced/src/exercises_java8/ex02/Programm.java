package exercises_java8.ex02;

import java.util.ArrayList;
import java.util.List;

public class Programm {
    private List<Runnable> runnables = new ArrayList<>();

    public Programm add(Runnable runnable){
        runnables.add(runnable);
        return this;
    }

    public void execute(){
        for (Runnable r : runnables){
            r.run();
        }
    }
}
