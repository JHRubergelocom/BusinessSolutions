create table PERSONEN
(
    id        BIGINT generated always as identity
        constraint "PERSONEN_pk"
            primary key,
    name      varchar(255),
    birthdate date,
    height    decimal(15, 2),
    weight    decimal(15, 2)
);
