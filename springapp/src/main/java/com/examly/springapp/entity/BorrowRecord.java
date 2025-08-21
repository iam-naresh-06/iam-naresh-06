package com.examly.springapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_records")
@Data
public class BorrowRecord {

    public enum Status {
        BORROWED, RETURNED, OVERDUE, LOST
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower; // Changed from User to Borrower

    @Column(nullable = false)
    private LocalDateTime borrowDate = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDateTime returnDate;

    @PositiveOrZero
    private Double fineAmount = 0.0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.BORROWED;

    private Integer renewalCount = 0;
}