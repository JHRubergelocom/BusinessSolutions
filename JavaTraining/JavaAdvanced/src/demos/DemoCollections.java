package demos;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

public class DemoCollections {
    public static void main(String[] args) {
        List<String> strings = Collections.synchronizedList(new ArrayList<String>());
    }
}
