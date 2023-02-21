package ex08_executerservice;

import java.util.concurrent.Callable;

public class PrimeCalculator implements Callable<Long> {
    private long primeMaxLocal = 1;

    private PrimeResult globalPrimeResult;
    public static final long MAX_LONG = 1000000;

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
            long dividerMax = (long) Math.sqrt(candidate);
            boolean dividerFound = false;
            for (long divider = 2; divider < dividerMax; divider++) {
                if(candidate % divider == 0) {
                    dividerFound = true;
                    break;
                }
                if(!dividerFound) {
                    primeMaxLocal = candidate;
                }
            }
        }
        return primeMaxLocal;
    }
}
