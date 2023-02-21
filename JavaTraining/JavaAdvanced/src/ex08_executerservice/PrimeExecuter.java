package ex08_executerservice;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class PrimeExecuter {
    public static final int NUMBER_OF_THREADS = 2;

    public static void main(String[] args) throws InterruptedException  {
        PrimeResult primeResult = new PrimeResult();

        ExecutorService executorService = Executors.newFixedThreadPool(3);
        List<Future> futures = new ArrayList<>();

        try {
            for (int i = 0; i < 100; i++) {
                Future<Long> futureResult = executorService.submit(new PrimeCalculator(primeResult));
                futures.add(futureResult);
            }
        } finally {
            executorService.shutdown();
        }

        for(Future<Long> f:futures) {
            try {
                System.out.println("Result from callable: " + f.get());
            } catch (ExecutionException e) {
                System.out.println(e.getMessage());
            }
        }

        System.out.println("All Threads startet");

    }
}
