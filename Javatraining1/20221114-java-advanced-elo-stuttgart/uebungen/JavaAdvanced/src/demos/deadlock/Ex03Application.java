package demos.deadlock;


public class Ex03Application   {


    public static void main(String[] args) throws InterruptedException {
        boolean optimized = false;
        System.out.println("Optimized: " + optimized);
        Object singleLock = new Object();

        Resource resourceA = new Resource();
        Resource resourceB = new Resource();
        resourceA.setResource(resourceB);
        resourceB.setResource(resourceA);

        if (optimized){
            resourceA.setLock(singleLock);
            resourceB.setLock(singleLock);
        }

        new Thread(resourceA, "ResourceA").start();
        new Thread(resourceB, "ResourceB").start();
        for (;;){
            Thread.sleep(1000);
            System.out.println("Running ...");
        }
    }



}

