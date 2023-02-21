package demos.readwritelock.resources;

public interface Resource {
    int read();
    void write(int data);
    int getNumberOfWrites();
    
    default double doCostlyThings() {
    	double result = 1; 
    	for (int i=0; i < 100; i++) {
    		result = result + Math.sin(result);
    	}
    	return result;    	
    }
}
