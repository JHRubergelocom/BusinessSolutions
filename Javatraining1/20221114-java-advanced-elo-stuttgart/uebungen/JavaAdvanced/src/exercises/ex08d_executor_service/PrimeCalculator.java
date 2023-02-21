package exercises.ex08d_executor_service;

import lombok.extern.java.Log;

import java.util.concurrent.Callable;

@Log
public class PrimeCalculator implements Callable<Long> {
    public static final long MAX_LONG = 10_000_000L;
    private long primeMaxLocal = 1;

    private PrimeResult globalPrimeResult;

    public PrimeCalculator(PrimeResult primeResult) {
        this.globalPrimeResult = primeResult;
    }

    @Override
    public Long call() {
        String myThreadName = Thread.currentThread().getName();
        for (long candidate = primeMaxLocal; candidate <= MAX_LONG; candidate++) {
            if (Thread.currentThread().isInterrupted()) {
                return Long.valueOf(0L);
            }
            long deviderMax = (long)Math.sqrt(candidate);
            boolean deviderFound = false;
            for (long devider = 2; devider < deviderMax; devider++){
                if (candidate % devider == 0) {
                    deviderFound = true;
                    break;
                }
            }
            if (!deviderFound) {
                primeMaxLocal = candidate;
                globalPrimeResult.reportPrimeNumber(myThreadName, primeMaxLocal);
            }
        }
        return primeMaxLocal;
    }
}
