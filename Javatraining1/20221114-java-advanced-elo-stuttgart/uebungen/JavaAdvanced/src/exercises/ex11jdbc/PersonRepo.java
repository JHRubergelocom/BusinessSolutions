package exercises.ex11jdbc;

import lombok.SneakyThrows;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PersonRepo {
    //language=Derby
    private final static String SQL_INSERT_PERSON = """
                insert into PERSONEN (NAME, BIRTHDATE, HEIGHT, WEIGHT)
                values (?,?,?,?)
            """;

    //language=derby
    private final static String SQL_SELECT_ALL = """
                select ID, NAME, BIRTHDATE, HEIGHT, WEIGHT FROM PERSONEN
                order by NAME
            """;

    //language=derby
    private final static String SQL_SELECT_BY_ID = """
                select ID, NAME, BIRTHDATE, HEIGHT, WEIGHT FROM PERSONEN
                where ID=?
            """;

    //language=Derby
    private final static String SQL_DELETE_PERSON_BY_ID = """
                delete from PERSONEN
                where ID = ?
            """;

    @SneakyThrows
    public Connection getConnection() {
        return DriverManager.getConnection(
                "jdbc:derby://localhost:1527/personen;create=true",
                "personen",
                "personen");
    }

    public List<Person> findAll() {
        List<Person> personList = new ArrayList<>();

        try (Connection con = getConnection()) {
            try (PreparedStatement stmt = con.prepareStatement(SQL_SELECT_ALL)) {
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    Person person = extractPerson(rs);
                    personList.add(person);
                }
                return personList;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private static Person extractPerson(ResultSet rs) throws SQLException {
        Person person = new Person();
        person.setId(rs.getLong("ID"));
        person.setName(rs.getString("NAME"));
        person.setHeight(rs.getDouble("HEIGHT"));
        person.setWeight(rs.getDouble("WEIGHT"));
        person.setBirthDate(rs.getDate("BIRTHDATE").toLocalDate());
        return person;
    }

    public Optional<Person> findById(Long id) {
        try (Connection con = getConnection()) {
            try (PreparedStatement stmt = con.prepareStatement(SQL_SELECT_BY_ID)) {
                stmt.setLong(1, id);
                ResultSet rs = stmt.executeQuery();
                if (!rs.next()) return Optional.empty();
                Person person = extractPerson(rs);

                return Optional.of(person);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Person save(Person person) {
        try (Connection con = getConnection()) {
            try (PreparedStatement stmt = con.prepareStatement(SQL_INSERT_PERSON, Statement.RETURN_GENERATED_KEYS)) {
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
                return person;
            } catch (SQLException e) {
                con.rollback();
                throw new RuntimeException(e);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void delete(Long id) {
        try(Connection con = getConnection()){
            try(PreparedStatement stmt = con.prepareStatement(SQL_DELETE_PERSON_BY_ID)){
                stmt.setLong(1, id);
                stmt.executeUpdate();
                con.commit();
            } catch (SQLException e) {
                con.rollback();
                throw new RuntimeException(e);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
