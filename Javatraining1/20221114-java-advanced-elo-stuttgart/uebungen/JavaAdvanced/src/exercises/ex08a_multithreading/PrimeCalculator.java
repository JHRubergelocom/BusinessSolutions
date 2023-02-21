package exercises.ex08a_multithreading;

import lombok.extern.java.Log;

@Log
public class PrimeCalculator implements Runnable {
    private long primeMax = 1;

    @Override
    public void run() {
        String myThreadName = Thread.currentThread().getName();
        for (long candidate = primeMax; candidate <= Long.MAX_VALUE; candidate++) {
            if (Thread.currentThread().isInterrupted()) {
                //log.info("Thread %s received intrrupt. Stopping".formatted(myThreadName));
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
                primeMax = candidate;
                //log.info("Thread %s found prime number %d".formatted(myThreadName, primeMax));
            }
        }
    }
}
