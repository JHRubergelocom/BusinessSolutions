package exercises.ex08c_synchronized;

import lombok.SneakyThrows;
import lombok.extern.java.Log;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicLong;

@Log
public class PrimeExecutor {

    public static final int NUMBER_OF_THREADS = 2;

    @SneakyThrows
    public static void main(String[] args) {
        PrimeResult primeResult = new PrimeResult();

        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < NUMBER_OF_THREADS; i++) {
            Thread thread = new Thread(new PrimeCalculator(primeResult), "PrimeCalc " + i);
            if (i==0) thread.setPriority(Thread.MAX_PRIORITY);
            else thread.setPriority(Thread.MIN_PRIORITY);
            threads.add(thread);
            thread.start();
        }
        log.info("All Threads started");

        boolean ever = true;
        NumberFormat numberFormat = NumberFormat.getInstance(Locale.GERMANY);
        for(;ever;){
            Thread.sleep(1000L);
            System.out.println(primeResult.getCurrentResults());
        }
    }
}
