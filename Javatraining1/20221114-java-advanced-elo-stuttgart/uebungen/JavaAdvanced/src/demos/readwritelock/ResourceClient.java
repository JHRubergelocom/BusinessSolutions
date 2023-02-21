package demos.readwritelock;



public class ResourceClient implements Runnable {
    private int numberOfIterations;
    private Resource resource;
    private int writeEveryNReads;

    public ResourceClient(int numberOfIterations, Resource resource, int writeEveryNReads) {
        this.numberOfIterations = numberOfIterations;
        this.resource = resource;
        this.writeEveryNReads = writeEveryNReads;
    }

    @Override
    public void run() {
        for (int j = 0; j < numberOfIterations; j++) {
            resource.read();
            if (j % writeEveryNReads == 0) resource.write(j);
        }
    }
}
