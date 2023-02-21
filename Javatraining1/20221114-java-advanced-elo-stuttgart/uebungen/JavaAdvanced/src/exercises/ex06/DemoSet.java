package exercises.ex06;

import java.util.*;

public class DemoSet {
    public static void main(String[] args) {
        Set<String> list = new TreeSet<>();
        System.out.println("Size: " + list.size());
        System.out.println("Empty? " + list.isEmpty());
        list.add("Eins");
        list.add("noch eins");
        list.add("noch eins");
        list.add("noch eins");
        list.add("noch eins 2");
        list.add("A noch eins 3");

        System.out.println("FOR EACH *".repeat(30));

        for (String elem:list) {
            System.out.println(elem);
        }

        System.out.println("ITERATOR *".repeat(30));

        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()){
            System.out.println(iterator.next());
            // iterator.remove();
        }

        System.out.println("for Each *".repeat(30));

        list.forEach(System.out::println);

    }
}
