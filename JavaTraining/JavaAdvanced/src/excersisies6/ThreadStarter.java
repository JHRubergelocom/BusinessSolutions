package excersisies6;

public class ThreadStarter {

    public static void main(String[] args) {
        Runnable runnable = ()->{
            for (int i = 0; i < 10; i++) {
                try {
                    Thread.sleep(1000L);
                    System.out.println("Thread: " + Thread.currentThread().getName()+ "Counter:" +i);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }

            }
        };
        new Thread(runnable).start();
        new Thread(runnable).start();
        System.out.println("Bye");

    }
}
