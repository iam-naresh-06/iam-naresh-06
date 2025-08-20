package com.examly.springapp.repository;

import com.examly.springapp.entity.Borrower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BorrowerRepository extends JpaRepository<Borrower, Long> {
    
    // Find borrower by user ID
    Optional<Borrower> findByUserId(Long userId);
    
    // Find borrower by library card number
    Optional<Borrower> findByLibraryCardNumber(String libraryCardNumber);
    
    // Find active borrowers
    List<Borrower> findByIsActiveTrue();
    
    // Find inactive borrowers
    List<Borrower> findByIsActiveFalse();
    
    // Search borrowers by user's name
  @Query("SELECT b FROM Borrower b WHERE b.user.firstName LIKE %:name% OR b.user.lastName LIKE %:name% OR b.user.username LIKE %:name%")
    List<Borrower> findByUserNameContaining(@Param("name") String name);
    // Search borrowers by library card number
    List<Borrower> findByLibraryCardNumberContaining(String cardNumber);
    
    // Find borrowers by membership type
    List<Borrower> findByMembershipType(String membershipType);
    
    // Count active borrowers
    long countByIsActiveTrue();
    
    // Check if library card number exists
    boolean existsByLibraryCardNumber(String libraryCardNumber);
    
    // Find borrowers who have reached their borrowing limit
    @Query("SELECT b FROM Borrower b WHERE b.currentBorrowedCount >= b.borrowingLimit AND b.isActive = true")
    List<Borrower> findBorrowersAtLimit();
    
    // Find borrowers with overdue books (you'll need to implement this with a join)
    @Query("SELECT DISTINCT b FROM Borrower b JOIN b.borrowHistory br WHERE br.status = 'OVERDUE'")
    List<Borrower> findBorrowersWithOverdueBooks();
}
