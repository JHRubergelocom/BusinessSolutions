package demos;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DemoCollections {
    public static void main(String[] args) {
        //erzeugen einer synchronized collection
        List<String> strings = Collections.synchronizedList(new ArrayList<String>());
    }
}
