package com.examly.springapp.repository;

import com.examly.springapp.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    
    // Count active borrows for a borrower
    long countByBorrowerIdAndStatus(Long borrowerId, BorrowRecord.Status status);
    
    // Check if borrower already has this book borrowed
    boolean existsByBookIdAndBorrowerIdAndStatus(Long bookId, Long borrowerId, BorrowRecord.Status status);
    
    // Get borrowing history for a borrower
    List<BorrowRecord> findByBorrowerIdOrderByBorrowDateDesc(Long borrowerId);
    
    // Find records due on a specific date
    List<BorrowRecord> findByDueDateAndStatus(LocalDate dueDate, BorrowRecord.Status status);
    
    // Find overdue records (due before today and still borrowed)
    List<BorrowRecord> findByDueDateBeforeAndStatus(LocalDate date, BorrowRecord.Status status);
    
    // Find all active borrows
    List<BorrowRecord> findByStatus(BorrowRecord.Status status);
    
    // Find borrow records for a specific book
    List<BorrowRecord> findByBookId(Long bookId);
    
    // Find borrow records by status for a borrower
    List<BorrowRecord> findByBorrowerIdAndStatus(Long borrowerId, BorrowRecord.Status status);
    
    // Custom query to find borrowers with fines
    @Query("SELECT br FROM BorrowRecord br WHERE br.fineAmount > 0 AND br.status = 'RETURNED'")
    List<BorrowRecord> findRecordsWithFines();
    
    // Find borrow records that need renewal
    @Query("SELECT br FROM BorrowRecord br WHERE br.dueDate <= :reminderDate AND br.status = 'BORROWED'")
    List<BorrowRecord> findRecordsDueForRenewal(@Param("reminderDate") LocalDate reminderDate);
    
    // Additional method to find by user ID through borrower
    @Query("SELECT br FROM BorrowRecord br WHERE br.borrower.user.id = :userId")
    List<BorrowRecord> findByUserId(@Param("userId") Long userId);
    
    // Count by user ID through borrower
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.borrower.user.id = :userId AND br.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") BorrowRecord.Status status);

    @Query("SELECT br FROM BorrowRecord br WHERE " +
           "br.status = :status AND " +
           "(br.dueDate BETWEEN :startDate AND :endDate OR br.dueDate < :currentDate)")
    List<BorrowRecord> findByDueDateBetweenOrDueDateBeforeAndStatus(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("currentDate") LocalDate currentDate,
        @Param("status") BorrowRecord.Status status
    );

}