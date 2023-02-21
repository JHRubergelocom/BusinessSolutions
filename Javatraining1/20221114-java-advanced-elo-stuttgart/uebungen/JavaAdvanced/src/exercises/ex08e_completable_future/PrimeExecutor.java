package exercises.ex08e_completable_future;

import lombok.extern.java.Log;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Log
public class PrimeExecutor {

    public static final int NUMBER_OF_THREADS = 2;

    public static void main(String[] args) {
        PrimeResult primeResult = new PrimeResult();

        ExecutorService executorService = Executors.newFixedThreadPool(3);
        List<Future> futures = new ArrayList<>();

        try {
            for (int i = 0; i < 100; i++) {
                CompletableFuture<Long> longCompletableFuture =
                        CompletableFuture.supplyAsync(() -> new PrimeCalculator(primeResult).call(),
                                executorService);
                longCompletableFuture.thenAcceptAsync(l -> System.out.println("Result from callable: " + l));
            }
        } finally {
            executorService.shutdown();
        }

        log.info("Main finished");
    }
}
