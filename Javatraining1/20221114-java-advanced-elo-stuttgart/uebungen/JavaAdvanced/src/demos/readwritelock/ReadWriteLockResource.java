package demos.readwritelock;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockResource implements Resource {
    private int data;
    private int numberOfWrites = 0;
    ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    Lock readLock = readWriteLock.readLock();
    Lock writeLock = readWriteLock.writeLock();

    @Override
    public int read(){
        readLock.lock();
        try {
        	double calculated = doCostlyThings();
            return data;
        } finally {
            readLock.unlock();
        }
    }

    @Override
    public void write(int data){
        writeLock.lock();
        try {
            this.data = data;
            numberOfWrites++;
        } finally {
            writeLock.unlock();
        }
    }

    @Override
    public int getNumberOfWrites() {
        return numberOfWrites;
    }
}
