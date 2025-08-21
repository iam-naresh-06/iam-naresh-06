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
    private String membershipType;
    private LocalDateTime membershipStartDate;
    private LocalDateTime membershipEndDate;

    // Add this relationship
    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL)
    private List<BorrowRecord> borrowHistory;

    // Helper methods remain the same...
    public boolean canBorrowMore() {
        return isActive && currentBorrowedCount < borrowingLimit;
    }

    public void incrementBorrowedCount() {
        if (currentBorrowedCount < borrowingLimit) {
            currentBorrowedCount++;
        }
    }

    public void decrementBorrowedCount() {
        if (currentBorrowedCount > 0) {
            currentBorrowedCount--;
        }
    }
}