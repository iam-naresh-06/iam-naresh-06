package com.examly.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "borrowers")
@Data
public class Borrower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(unique = true, nullable = false)
    private String libraryCardNumber;

    @Column(nullable = false)
    private Integer borrowingLimit = 5;

    @Column(nullable = false)
    private Integer currentBorrowedCount = 0;

    @Column(nullable = false)
    private Boolean isActive = true;

    private String emergencyContact;
    private String membershipType; // e.g., "STUDENT", "FACULTY", "STAFF"
    private LocalDateTime membershipStartDate;
    private LocalDateTime membershipEndDate;

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL)
    private List<BorrowRecord> borrowHistory;

    // Helper method to check if borrower can borrow more books
    public boolean canBorrowMore() {
        return isActive && currentBorrowedCount < borrowingLimit;
    }

    // Helper method to increment borrowed count
    public void incrementBorrowedCount() {
        if (currentBorrowedCount < borrowingLimit) {
            currentBorrowedCount++;
        }
    }

    // Helper method to decrement borrowed count
    public void decrementBorrowedCount() {
        if (currentBorrowedCount > 0) {
            currentBorrowedCount--;
        }
    }
    // Add this method to Borrower entity
    public String getUserEmail() {
        return user != null ? user.getEmail() : null;
    }

    public String getUserFullName() {
        return user != null ? user.getFirstName() + " " + user.getLastName() : null;
    }
}