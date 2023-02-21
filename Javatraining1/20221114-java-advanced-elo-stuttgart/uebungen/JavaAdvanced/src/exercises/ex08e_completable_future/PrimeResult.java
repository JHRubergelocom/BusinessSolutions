package exercises.ex08e_completable_future;

public class PrimeResult {
    private long primeMax = 1;
    private String threadName = "";

    public long reportPrimeNumber(String threadName, long threadPrimeMax){
        if (threadPrimeMax <= primeMax) return primeMax;
        synchronized (this){
            if (threadPrimeMax > primeMax){
                primeMax = threadPrimeMax;
                this.threadName = threadName;
            }
            return primeMax;
        }
    }

    synchronized public String getCurrentResults(){
        return threadName + " reported " + primeMax;
    }


}
