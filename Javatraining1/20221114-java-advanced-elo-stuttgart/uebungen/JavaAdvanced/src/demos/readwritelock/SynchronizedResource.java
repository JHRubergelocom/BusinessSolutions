package demos.readwritelock;

public class SynchronizedResource implements Resource{
    private int data;
    private int numberOfWrites = 0;

    public synchronized int read(){
    	double calculated = doCostlyThings();
        return data;
    }

    public synchronized void write(int data){
        this.data = data;
        numberOfWrites++;
    }

    @Override
    public int getNumberOfWrites() {
        return numberOfWrites;
    }
}
