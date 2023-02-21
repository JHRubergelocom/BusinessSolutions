package exercises.ex08b_atomic_long;

import lombok.extern.java.Log;

import java.util.concurrent.atomic.AtomicLong;

@Log
public class PrimeCalculator implements Runnable {
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
                candidate = primeMaxGlobal.accumulateAndGet(primeMaxLocal,
                        (currentGlobalMax, localMax) -> localMax > currentGlobalMax ? localMax : currentGlobalMax);
            }
        }
    }
}
