package exercises.ex06;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class DemoList {
    public static void main(String[] args) {
        List<String> list = new LinkedList<>();
        System.out.println("Size: " + list.size());
        System.out.println("Empty? " + list.isEmpty());
        list.add("Eins");
        list.add(0, "Zwei");
        list.set(1, "Drei");
        list.add("noch eins");
        list.add("noch eins");

        System.out.println("FOR I *".repeat(30));


        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i));
        }

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
