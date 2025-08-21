package com.examly.springapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Entity
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 50)
    private String author;

    @Column(unique = true, nullable = false, length = 13)
    private String isbn;

    private Integer publicationYear;
    private String genre;
    private String publisher;
    private String description;
    private String location;

    @PositiveOrZero
    private Integer totalCopies = 1;

    @PositiveOrZero
    private Integer availableCopies = 1;

    // REMOVE THIS LINE - It's causing circular dependency
    // @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    // private List<BorrowRecord> borrowHistory;

    public boolean isAvailable() {
        return availableCopies != null && availableCopies > 0;
    }
}