package ex08_completable_future;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class PrimeExecuter {
    public static final int NUMBER_OF_THREADS = 2;

    public static void main(String[] args) throws InterruptedException  {
        PrimeResult primeResult = new PrimeResult();

        ExecutorService executorService = Executors.newFixedThreadPool(3);

        try {
            for (int i = 0; i < 100; i++) {
                CompletableFuture<Long> longCompletableFuture = CompletableFuture.supplyAsync(() -> new PrimeCalculator(primeResult).call(), executorService);
                longCompletableFuture.thenAcceptAsync(l -> System.out.println("result from callable: "+l));
            }
        } finally {
            executorService.shutdown();
        }

        System.out.println("All Threads startet");

    }
}
