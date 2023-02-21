package demos;

import java.util.ArrayList;
import java.util.List;

public class Programm {

    List<Runnable> l = new ArrayList<>();
    public Programm add(Runnable r) {
        l.add(r);
        return this;
    }

    public void execute() {
        for (Runnable r: l) {
            r.run();
        }
    }
}


