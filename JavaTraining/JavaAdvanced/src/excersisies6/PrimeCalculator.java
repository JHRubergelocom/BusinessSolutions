package excersisies6;

public class PrimeCalculator implements Runnable{
    private long primeMax = 1;

    @Override
    public void run() {
        String myThreadName = Thread.currentThread().getName();
        for (long candidate = primeMax; candidate <= Long.MAX_VALUE; candidate++) {
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("Thread %s received interrupt. Stopping".formatted(myThreadName));
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
                    primeMax = candidate;
                    System.out.println("Thread %s found prime number %d".formatted(myThreadName, primeMax));
                }
            }
        }
    }
}
