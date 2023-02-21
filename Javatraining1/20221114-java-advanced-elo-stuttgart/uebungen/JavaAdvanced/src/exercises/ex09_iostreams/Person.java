package exercises.ex09_iostreams;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Person {
    private Long id;
    private String name;
    private LocalDate birthDate;

    @EqualsAndHashCode.Exclude
    private double height;
    @EqualsAndHashCode.Exclude
    private double weight;

    public Person(Long id) {
        this.id = id;
    }

    public void setWeight(double weight) {
        if (weight <= 0) return;
        this.weight = weight;
    }

    public static Person fromCsvString(String csvString) {
        Person person = new Person();
        String[] split = csvString.split(",");
        person.setId(Long.parseLong(split[0]));
        person.setName(split[1]);
        person.setBirthDate(LocalDate.parse(split[2]));
        person.setHeight(Double.parseDouble(split[3]));
        person.setWeight(Double.parseDouble(split[4]));
        return person;
    }

    public String toCsvString() {
        return id + "," + name + "," + birthDate + "," + height + "," + weight;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person person)) return false;

        if (getId() != null ? !getId().equals(person.getId()) : person.getId() != null) return false;
        if (getName() != null ? !getName().equals(person.getName()) : person.getName() != null) return false;
        return getBirthDate() != null ? getBirthDate().equals(person.getBirthDate()) : person.getBirthDate() == null;
    }

    @Override
    public int hashCode() {
        int result = getId() != null ? getId().hashCode() : 0;
        result = 31 * result + (getName() != null ? getName().hashCode() : 0);
        result = 31 * result + (getBirthDate() != null ? getBirthDate().hashCode() : 0);
        return result;
    }
}
