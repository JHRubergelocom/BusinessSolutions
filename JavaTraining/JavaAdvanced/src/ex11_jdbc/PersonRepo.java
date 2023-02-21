package ex11_jdbc;

import excersies.Person;
import lombok.SneakyThrows;

import java.sql.*;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.List;
import java.util.Optional;

public class PersonRepo {

    private final static String SQL_INSERT_PERSON = """
                insert into PERSONEN (NAME, BIRTHDATE, HEIGHT, WEIGHT)
                values (?,?,?,?)
            """;

    private final static String SQL_SELECT_ALL = """
                select ID, NAME, BIRTHDATE, HEIGHT, WEIGHT from PERSONEN
            """;

    @SneakyThrows
    public Connection getConnection() {
        return DriverManager.getConnection("jdbc:derby://localhost:1527/personen;create=true", "personen", "personen");
    }

    public List<Person> findAll(){
        List<Person> personList = new ArrayList<>();

        try(Connection con = getConnection()) {
            try(PreparedStatement stmt = con.prepareStatement(SQL_SELECT_ALL, Statement.RETURN_GENERATED_KEYS)) {
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Person person = new Person();
                        person.setId(rs.getLong("ID"));
                        person.setName(rs.getString("NAME"));
                        person.setHeight(rs.getDouble("HEIGHT"));
                        person.setWeight(rs.getDouble("WEIGHT"));
                        person.setBirthDate(rs.getDate("BIRTHDATE").toLocalDate());
                        personList.add(person);
                    }
                    return personList;
                }
            } catch (SQLException e) {
                con.rollback();
                throw new RuntimeException(e);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<Person> findById(Long id) {
        return Optional.empty();
    }

    public void save (Person person) {
        try(Connection con = getConnection()) {
            try(PreparedStatement stmt = con.prepareStatement(SQL_INSERT_PERSON, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setString(1, person.getName());
                stmt.setDate(2, Date.valueOf(person.getBirthDate()));
                stmt.setDouble(3, person.getHeight());
                stmt.setDouble(4, person.getWeight());

                stmt.executeUpdate();
                ResultSet generatedKeys = stmt.getGeneratedKeys();
                generatedKeys.next();
                long personId = generatedKeys.getLong(1);
                person.setId(personId);
                con.commit();
            } catch (SQLException e) {
                con.rollback();
                throw new RuntimeException(e);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    static public void delete(Long id) {

    }
}
