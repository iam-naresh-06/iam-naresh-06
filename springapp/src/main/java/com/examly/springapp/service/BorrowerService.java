package com.examly.springapp.service;

import com.examly.springapp.entity.Borrower;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.BorrowerRepository;
import com.examly.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BorrowerService {

    private final BorrowerRepository borrowerRepository;
    private final UserRepository userRepository;

    public List<Borrower> getAllBorrowers() {
        return borrowerRepository.findAll();
    }

    public Optional<Borrower> getBorrowerById(Long id) {
        return borrowerRepository.findById(id);
    }

    public Optional<Borrower> getBorrowerByUserId(Long userId) {
        return borrowerRepository.findByUserId(userId);
    }

    public Optional<Borrower> getBorrowerByCardNumber(String cardNumber) {
        return borrowerRepository.findByLibraryCardNumber(cardNumber);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower createBorrower(Long userId, String membershipType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check if user is already a borrower
        if (borrowerRepository.findByUserId(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already registered as a borrower");
        }

        Borrower borrower = new Borrower();
        borrower.setUser(user);
        borrower.setLibraryCardNumber(generateLibraryCardNumber());
        borrower.setMembershipType(membershipType);
        borrower.setMembershipStartDate(LocalDateTime.now());
        borrower.setMembershipEndDate(LocalDateTime.now().plusYears(1)); // 1 year membership
        borrower.setBorrowingLimit(5); // Default limit
        borrower.setIsActive(true);

        return borrowerRepository.save(borrower);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower updateBorrower(Long id, Borrower borrowerDetails) {
        Borrower borrower = borrowerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrower not found"));

        if (borrowerDetails.getBorrowingLimit() != null) {
            borrower.setBorrowingLimit(borrowerDetails.getBorrowingLimit());
        }
        if (borrowerDetails.getEmergencyContact() != null) {
            borrower.setEmergencyContact(borrowerDetails.getEmergencyContact());
        }
        if (borrowerDetails.getMembershipType() != null) {
            borrower.setMembershipType(borrowerDetails.getMembershipType());
        }
        if (borrowerDetails.getIsActive() != null) {
            borrower.setIsActive(borrowerDetails.getIsActive());
        }
        if (borrowerDetails.getMembershipEndDate() != null) {
            borrower.setMembershipEndDate(borrowerDetails.getMembershipEndDate());
        }

        return borrowerRepository.save(borrower);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBorrower(Long id) {
        Borrower borrower = borrowerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrower not found"));
        borrowerRepository.delete(borrower);
    }

    public List<Borrower> searchBorrowersByName(String name) {
        return borrowerRepository.findByUserNameContaining(name);
    }

    public List<Borrower> searchBorrowersByCardNumber(String cardNumber) {
        return borrowerRepository.findByLibraryCardNumberContaining(cardNumber);
    }

    public List<Borrower> getActiveBorrowers() {
        return borrowerRepository.findByIsActiveTrue();
    }

    public List<Borrower> getInactiveBorrowers() {
        return borrowerRepository.findByIsActiveFalse();
    }

    public List<Borrower> getBorrowersByMembershipType(String membershipType) {
        return borrowerRepository.findByMembershipType(membershipType);
    }

    public List<Borrower> getBorrowersAtLimit() {
        return borrowerRepository.findBorrowersAtLimit();
    }

    public long getActiveBorrowersCount() {
        return borrowerRepository.countByIsActiveTrue();
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower renewMembership(Long borrowerId) {
        Borrower borrower = borrowerRepository.findById(borrowerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrower not found"));

        borrower.setMembershipEndDate(LocalDateTime.now().plusYears(1));
        borrower.setIsActive(true);

        return borrowerRepository.save(borrower);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower suspendBorrower(Long borrowerId) {
        Borrower borrower = borrowerRepository.findById(borrowerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrower not found"));

        borrower.setIsActive(false);
        return borrowerRepository.save(borrower);
    }

    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Borrower activateBorrower(Long borrowerId) {
        Borrower borrower = borrowerRepository.findById(borrowerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrower not found"));

        borrower.setIsActive(true);
        return borrowerRepository.save(borrower);
    }

    // Helper method to generate unique library card number
    private String generateLibraryCardNumber() {
        String cardNumber;
        do {
            cardNumber = "LC" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (borrowerRepository.existsByLibraryCardNumber(cardNumber));
        
        return cardNumber;
    }
}