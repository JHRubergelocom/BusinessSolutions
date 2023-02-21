package exercises.ex10gson;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.time.LocalDate;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDate.class, new LocalDateTypeAdapter())
                .create();
        List<Person> personList = PersonFactory.createPersonList(100);
        String personsJson = gson.toJson(personList);
        System.out.println(personsJson);
        System.out.println("*".repeat(20));
        List<Person> personsFromJson =
                gson.fromJson(personsJson, new TypeToken<List<Person>>() {}.getType());
        personsFromJson.forEach(System.out::println);
    }
}
