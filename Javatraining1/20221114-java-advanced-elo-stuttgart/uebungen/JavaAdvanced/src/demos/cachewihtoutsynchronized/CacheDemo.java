package demos.cachewihtoutsynchronized;

import exercises.ex05streams.Person;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class CacheDemo {
    private volatile Map<Long, Person> cache = new HashMap<>();

    // do every second
    public void refreshCache(){
        HashMap<Long, Person> temp = new HashMap<>();
        List<Person> people = loadFromDb();
        for (Person p:people){
            temp.put(p.getId(), p);
        }
        cache = temp;
    }

    public Person findPersonById(Long id){
        return cache.get(id);
    }

    public List<Person> loadFromDb(){
        return new ArrayList<>();
    }
}
