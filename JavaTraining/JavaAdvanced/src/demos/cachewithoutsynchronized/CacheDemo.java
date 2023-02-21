package demos.cachewithoutsynchronized;

import demos.Person;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class CacheDemo {
    private volatile Map<Long, Person> cache = new HashMap<>();

    public void refreshCache(){
        HashMap<Long,Person> temp = new HashMap<>();
        List<Person> persons = loadFromDb();
        for (Person p:persons) {
            temp.put(p.getId(), p);
        }
        cache = temp;
    }

    public Person findPersonById(Long id) {
        return cache.get(id);
    }

    public List<Person> loadFromDb(){
        return new LinkedList<>();
    }
}
