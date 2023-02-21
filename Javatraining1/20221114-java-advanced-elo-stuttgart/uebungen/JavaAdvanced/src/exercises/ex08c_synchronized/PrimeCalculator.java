package exercises.ex08c_synchronized;

import lombok.extern.java.Log;

import java.util.concurrent.atomic.AtomicLong;

@Log
public class PrimeCalculator implements Runnable {
    private long primeMaxLocal = 1;

    private PrimeResult globalPrimeResult;

    public PrimeCalculator(PrimeResult primeResult) {
        this.globalPrimeResult = primeResult;
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
                candidate = globalPrimeResult.reportPrimeNumber(myThreadName, primeMaxLocal);
            }
        }
    }
}
