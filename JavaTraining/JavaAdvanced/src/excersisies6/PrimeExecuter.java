package excersisies6;

import java.util.ArrayList;
import java.util.List;

public class PrimeExecuter {
    public static void main(String[] args) {
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Thread thread = new Thread(new PrimeCalculator(), "PrimeCalc " + i);
            if (i==0) thread.setPriority(Thread.MAX_PRIORITY);
            else thread.setPriority(Thread.MIN_PRIORITY);
            threads.add(thread);
            thread.start();
        }
        System.out.println("All Threads start");
        for(Thread t:threads) {
            try {
                t.join(1000);
            } catch (InterruptedException e) {
                System.out.println("Ich wurde unterbrochen. Byebye");
            }
        }

        System.out.println("Ich kann nicht länger warten. Ende.");
        for (Thread t : threads) {
            t.interrupt();
        }

    }
}
