package com.examly.springapp.controller;

import com.examly.springapp.entity.BorrowRecord;
import com.examly.springapp.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}/borrower/{borrowerId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public BorrowRecord borrowBook(@PathVariable Long bookId, @PathVariable Long borrowerId) {
        return borrowService.borrowBook(bookId, borrowerId);
    }

    @PostMapping("/return/{borrowRecordId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public BorrowRecord returnBook(@PathVariable Long borrowRecordId) {
        return borrowService.returnBook(borrowRecordId);
    }

    @PostMapping("/renew/{borrowRecordId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public BorrowRecord renewBook(@PathVariable Long borrowRecordId) {
        return borrowService.renewBook(borrowRecordId);
    }

    @GetMapping("/history/borrower/{borrowerId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<BorrowRecord> getBorrowingHistoryForBorrower(@PathVariable Long borrowerId) {
        return borrowService.getBorrowingHistoryForBorrower(borrowerId);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<BorrowRecord> getActiveBorrows() {
        return borrowService.getAllActiveBorrows();
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<BorrowRecord> getOverdueBorrows() {
        return borrowService.getOverdueBorrows();
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<BorrowRecord> getBorrowHistoryForBook(@PathVariable Long bookId) {
        // You'll need to add this method to BorrowService
        // return borrowService.getBorrowHistoryForBook(bookId);
        throw new UnsupportedOperationException("Method not implemented yet");
    }
}