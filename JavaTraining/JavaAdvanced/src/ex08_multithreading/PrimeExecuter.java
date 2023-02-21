package ex08_multithreading;

import lombok.SneakyThrows;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class PrimeExecuter {
    public static final int NUMBER_OF_THREADS = 2;
    public static void main(String[] args) throws InterruptedException {
        AtomicLong maxPrime = new AtomicLong(1L);

        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < NUMBER_OF_THREADS; i++) {
            Thread thread = new Thread(new PrimeCalculator(maxPrime), "PrimeCalc " + i);
            if (i==0) thread.setPriority(Thread.MAX_PRIORITY);
            else thread.setPriority(Thread.MIN_PRIORITY);
            threads.add(thread);
            thread.start();
        }
        System.out.println("All Threads start");
        boolean ever = true;
        for(;ever;) {
            Thread.sleep(1000L);
            System.out.println("Current max prime: " +maxPrime.get());
        }
    }
}
