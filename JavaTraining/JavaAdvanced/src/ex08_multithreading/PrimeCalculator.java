package ex08_multithreading;

import java.util.concurrent.atomic.AtomicLong;

public class PrimeCalculator implements Runnable{
    private long primeMaxLocal = 1;

    private AtomicLong primeMaxGlobal;

    public PrimeCalculator(AtomicLong primeMaxGlobal) {
        this.primeMaxGlobal = primeMaxGlobal;
    }

    @Override
    public void run() {
        String myThreadName = Thread.currentThread().getName();
        for (long candidate = primeMaxLocal; candidate <= Long.MAX_VALUE; candidate++) {
            if (Thread.currentThread().isInterrupted()) {
                return;
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
                    primeMaxGlobal.accumulateAndGet(primeMaxLocal, (currentGlobalMax, localMax)->
                            localMax > currentGlobalMax ? localMax: currentGlobalMax);
                }
            }
        }
    }
}
