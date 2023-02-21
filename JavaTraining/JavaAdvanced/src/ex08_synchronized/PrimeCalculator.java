package ex08_synchronized;

import java.util.concurrent.atomic.AtomicLong;

public class PrimeCalculator implements Runnable{
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
            long dividerMax = (long) Math.sqrt(candidate);
            boolean dividerFound = false;
            for (long divider = 2; divider < dividerMax; divider++) {
                if(candidate % divider == 0) {
                    dividerFound = true;
                    break;
                }
                if(!dividerFound) {
                    primeMaxLocal = candidate;
                    candidate = globalPrimeResult.reportPrimeNumber(myThreadName,primeMaxLocal);
                }
            }
        }
    }
}
