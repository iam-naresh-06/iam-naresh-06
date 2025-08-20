package com.examly.springapp.service;

import com.examly.springapp.entity.Book;
import com.examly.springapp.entity.BorrowRecord;
import com.examly.springapp.entity.Borrower;
import com.examly.springapp.repository.BookRepository;
import com.examly.springapp.repository.BorrowRecordRepository;
import com.examly.springapp.repository.BorrowerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final BorrowerRepository borrowerRepository;

    private static final int STANDARD_LOAN_DAYS = 14;

    @Transactional
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public BorrowRecord borrowBook(Long bookId, Long borrowerId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        Borrower borrower = borrowerRepository.findById(borrowerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrower not found"));

        // Check if borrower is active
        if (!borrower.getIsActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Borrower account is inactive");
        }

        // Check if book is available
        if (!book.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Book is not available for borrowing");
        }

        // Check if borrower has reached their limit
        if (!borrower.canBorrowMore()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, 
                "Borrower has reached the maximum borrowing limit of " + borrower.getBorrowingLimit() + " books");
        }

        // Check if borrower already has this book
        boolean alreadyBorrowed = borrowRecordRepository.existsByBookIdAndBorrowerIdAndStatus(
            bookId, borrowerId, BorrowRecord.Status.BORROWED);
        if (alreadyBorrowed) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Borrower has already borrowed a copy of this book");
        }

        // Create borrow record
        BorrowRecord record = new BorrowRecord();
        record.setBook(book);
        record.setBorrower(borrower);
        record.setDueDate(LocalDate.now().plusDays(STANDARD_LOAN_DAYS));
        record.setStatus(BorrowRecord.Status.BORROWED);

        // Update book inventory
        book.setAvailableCopies(book.getAvailableCopies() - 1);

        // Update borrower's borrowed count
        borrower.incrementBorrowedCount();

        // Save everything
        bookRepository.save(book);
        borrowerRepository.save(borrower);
        return borrowRecordRepository.save(record);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public BorrowRecord returnBook(Long borrowRecordId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Book has already been returned");
        }

        record.setStatus(BorrowRecord.Status.RETURNED);
        record.setReturnDate(java.time.LocalDateTime.now());

        // Update book inventory
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);

        // Update borrower's borrowed count
        Borrower borrower = record.getBorrower();
        borrower.decrementBorrowedCount();

        // Calculate fine if overdue (simplified)
        if (record.getReturnDate().toLocalDate().isAfter(record.getDueDate())) {
            long daysOverdue = record.getDueDate().until(record.getReturnDate().toLocalDate()).getDays();
            record.setFineAmount(daysOverdue * 0.50); // $0.50 per day
        }

        bookRepository.save(book);
        borrowerRepository.save(borrower);
        return borrowRecordRepository.save(record);
    }

    public List<BorrowRecord> getBorrowingHistoryForBorrower(Long borrowerId) {
        return borrowRecordRepository.findByBorrowerIdOrderByBorrowDateDesc(borrowerId); // Fixed: borrowerId instead of borrowId
    }
    // New method to get borrowing history by user ID
    public List<BorrowRecord> getBorrowingHistoryForUser(Long userId) {
        return borrowRecordRepository.findByUserId(userId);
    }

    public List<BorrowRecord> getAllActiveBorrows() {
        return borrowRecordRepository.findByStatus(BorrowRecord.Status.BORROWED);
    }

    public List<BorrowRecord> getOverdueBorrows() {
        return borrowRecordRepository.findByDueDateBeforeAndStatus(LocalDate.now(), BorrowRecord.Status.BORROWED);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public BorrowRecord renewBook(Long borrowRecordId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (record.getStatus() != BorrowRecord.Status.BORROWED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only borrowed books can be renewed");
        }

        if (record.getRenewalCount() >= 2) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Maximum renewals reached for this book");
        }

        record.setDueDate(record.getDueDate().plusDays(STANDARD_LOAN_DAYS));
        record.setRenewalCount(record.getRenewalCount() + 1);

        return borrowRecordRepository.save(record);
    }

    // Helper method to check if a user can borrow more books
    public boolean canUserBorrowMore(Long userId) {
        long activeBorrows = borrowRecordRepository.countByUserIdAndStatus(userId, BorrowRecord.Status.BORROWED);
        // You might want to get the borrower's limit from the borrower entity
        return activeBorrows < 5; // Default limit of 5
    }
}