package com.examly.springapp.service;

import com.examly.springapp.entity.BorrowRecord;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.BorrowRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final BorrowRecordRepository borrowRecordRepository;

    @Scheduled(cron = "0 0 8 * * ?")
    public void checkDueDates() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate today = LocalDate.now();

        List<BorrowRecord> dueSoon = borrowRecordRepository.findByDueDateAndStatus(tomorrow, BorrowRecord.Status.BORROWED);
        for (BorrowRecord record : dueSoon) {
            User user = record.getBorrower().getUser(); // Changed from record.getUser()
            String message = "Reminder: Your book '" + record.getBook().getTitle() + "' is due tomorrow.";
            log.info("Due Soon Notification for {}: {}", user.getEmail(), message);
        }

        List<BorrowRecord> overdue = borrowRecordRepository.findByDueDateBeforeAndStatus(today, BorrowRecord.Status.BORROWED);
        for (BorrowRecord record : overdue) {
            User user = record.getBorrower().getUser(); // Changed from record.getUser()
            String message = "Overdue: Your book '" + record.getBook().getTitle() + "' was due on " + record.getDueDate() + ".";
            log.info("Overdue Notification for {}: {}", user.getEmail(), message);
        }
    }

    public void sendReturnReceipt(BorrowRecord record) {
        User user = record.getBorrower().getUser(); // Changed from record.getUser()
        String message = "Thank you for returning '" + record.getBook().getTitle() + "'.";
        if (record.getFineAmount() > 0) {
            message += " A fine of $" + record.getFineAmount() + " was applied to your account.";
        }
        log.info("Return Receipt for {}: {}", user.getEmail(), message);
    }
}