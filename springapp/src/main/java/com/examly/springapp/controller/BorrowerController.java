package com.examly.springapp.controller;

import com.examly.springapp.entity.Borrower;
import com.examly.springapp.service.BorrowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/borrowers")
@RequiredArgsConstructor
public class BorrowerController {

    private final BorrowerService borrowerService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> getAllBorrowers() {
        return borrowerService.getAllBorrowers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public ResponseEntity<Borrower> getBorrowerById(@PathVariable Long id) {
        Optional<Borrower> borrower = borrowerService.getBorrowerById(id);
        return borrower.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public ResponseEntity<Borrower> getBorrowerByUserId(@PathVariable Long userId) {
        Optional<Borrower> borrower = borrowerService.getBorrowerByUserId(userId);
        return borrower.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/card/{cardNumber}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public ResponseEntity<Borrower> getBorrowerByCardNumber(@PathVariable String cardNumber) {
        Optional<Borrower> borrower = borrowerService.getBorrowerByCardNumber(cardNumber);
        return borrower.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower createBorrower(@RequestBody CreateBorrowerRequest request) {
        return borrowerService.createBorrower(request.userId, request.membershipType);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower updateBorrower(@PathVariable Long id, @RequestBody Borrower borrowerDetails) {
        return borrowerService.updateBorrower(id, borrowerDetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBorrower(@PathVariable Long id) {
        borrowerService.deleteBorrower(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search/name")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> searchBorrowersByName(@RequestParam String name) {
        return borrowerService.searchBorrowersByName(name);
    }

    @GetMapping("/search/card")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> searchBorrowersByCardNumber(@RequestParam String cardNumber) {
        return borrowerService.searchBorrowersByCardNumber(cardNumber);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> getActiveBorrowers() {
        return borrowerService.getActiveBorrowers();
    }

    @GetMapping("/inactive")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> getInactiveBorrowers() {
        return borrowerService.getInactiveBorrowers();
    }

    @GetMapping("/membership/{type}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> getBorrowersByMembershipType(@PathVariable String type) {
        return borrowerService.getBorrowersByMembershipType(type);
    }

    @GetMapping("/at-limit")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public List<Borrower> getBorrowersAtLimit() {
        return borrowerService.getBorrowersAtLimit();
    }

    @GetMapping("/count/active")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public long getActiveBorrowersCount() {
        return borrowerService.getActiveBorrowersCount();
    }

    @PostMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower renewMembership(@PathVariable Long id) {
        return borrowerService.renewMembership(id);
    }

    @PostMapping("/{id}/suspend")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower suspendBorrower(@PathVariable Long id) {
        return borrowerService.suspendBorrower(id);
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower activateBorrower(@PathVariable Long id) {
        return borrowerService.activateBorrower(id);
    }

    // Request DTO for creating borrower
    public static class CreateBorrowerRequest {
        public Long userId;
        public String membershipType;
    }
}