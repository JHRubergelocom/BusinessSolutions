package exercises.ex08a_multithreading;

import lombok.extern.java.Log;

import java.util.ArrayList;
import java.util.List;

@Log
public class PrimeExecutor {
    public static void main(String[] args) {
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Thread thread = new Thread(new PrimeCalculator(), "PrimeCalc " + i);
            if (i==0) thread.setPriority(Thread.MAX_PRIORITY);
            else thread.setPriority(Thread.MIN_PRIORITY);
            threads.add(thread);
            thread.start();
        }
        log.info("All Threads start");

        for (Thread t:threads){
            try {
                t.join(100);
            } catch (InterruptedException e) {
                log.info("Ich wurde unterbrochen. Byebye");
                return;
            }
        }

        log.info("Ich kann nicht länger warten. Ende.");
        /*
        for (Thread t :threads){
            t.interrupt();
        }
         */

    }
}
