package demos.readwritelock;



import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static java.lang.System.currentTimeMillis;

public class Ex14Application {


    public static void main(String[] args) throws InterruptedException {
        Resource resourceSynchronized = new SynchronizedResource();
        testResource(resourceSynchronized);

        Resource resourceReadWriteLock = new ReadWriteLockResource();
        testResource(resourceReadWriteLock);
    }

    public static void testResource(Resource resource) throws InterruptedException {
        for (int j = 0; j < 5; j++) {
            long start = currentTimeMillis();
            ExecutorService executorService = Executors.newFixedThreadPool(100);

            for (int i = 0; i < 1000; i++) {
                executorService.submit(new ResourceClient(1000, resource, 1));
            }
            executorService.shutdown();
            executorService.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS);
            long duration = currentTimeMillis() - start;
            System.out.println("Duration for " + resource.getClass().getSimpleName() + ": " + duration);
            System.out.println("Number of writes: " + resource.getNumberOfWrites());
        }
    }
}
