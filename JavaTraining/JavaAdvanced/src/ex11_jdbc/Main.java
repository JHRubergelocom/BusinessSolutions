package ex11_jdbc;

import excersies.Person;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        /*
        List<Person> personList = PersonFactory.createPersonList(1000);
        PersonRepo repo = new PersonRepo();
        personList.stream()
                .peek(p -> repo.save(p))
                .forEach(p-> System.out.println(p));

         */

        List<Person> personList = new PersonRepo().findAll();
        personList.forEach(p-> System.out.println(p));

    }
}
