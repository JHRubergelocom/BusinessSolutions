package ex11_jdbc;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private  Long id;
    private LocalDate date;
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    transient private Person person;
}
