package demos.deadlock;

import java.util.concurrent.ThreadLocalRandom;

public class Resource implements Runnable{
    private Resource resource;
    private Object lock = this;

    @Override
    public void run() {
        for(;;){
            resource.doSynchronized(true);
        }
    }

    public void doSynchronized(boolean call){
        synchronized (lock) {
            Integer i = ThreadLocalRandom.current().nextInt();
            if (call) resource.doSynchronized(false);
        }
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public void setLock(Object lock) {
        this.lock = lock;
    }
}
