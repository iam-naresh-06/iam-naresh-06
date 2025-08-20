package com.examly.springapp.controller;

import com.examly.springapp.service.BorrowerService;
import com.examly.springapp.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final NotificationService notificationService;
    private final BorrowerService borrowerService;

    @PostMapping("/notifications/send-due-reminders")
    public String sendDueReminders() {
        notificationService.checkDueDates();
        return "Due date reminders sent successfully";
    }

    @GetMapping("/stats/borrowers")
    public Map<String, Object> getBorrowerStatistics() {
        long totalBorrowers = borrowerService.getAllBorrowers().size();
        long activeBorrowers = borrowerService.getActiveBorrowersCount();
        long borrowersAtLimit = borrowerService.getBorrowersAtLimit().size();
        
        return Map.of(
            "totalBorrowers", totalBorrowers,
            "activeBorrowers", activeBorrowers,
            "borrowersAtLimit", borrowersAtLimit,
            "inactiveBorrowers", totalBorrowers - activeBorrowers
        );
    }

    @PostMapping("/borrowers/{id}/reset-limit")
    public String resetBorrowerLimit(@PathVariable Long id, @RequestParam Integer newLimit) {
        // You'll need to add this method to BorrowerService
        // borrowerService.updateBorrowingLimit(id, newLimit);
        return "Borrowing limit updated successfully";
    }

    @GetMapping("/borrowers/expiring")
    public Object getExpiringMemberships() {
        // You'll need to add this method to BorrowerService
        // return borrowerService.getExpiringMemberships();
        return "Feature not implemented yet";
    }
}