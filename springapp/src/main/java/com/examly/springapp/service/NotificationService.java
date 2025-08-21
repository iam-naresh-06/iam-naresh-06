package com.examly.springapp.service;

import com.examly.springapp.entity.BorrowRecord;
import com.examly.springapp.entity.Notification;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.NotificationRepository;
import com.examly.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final BorrowService borrowService;

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId);
    }

    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Automated notification methods
    public void createDueDateReminder(Long userId, String bookTitle, LocalDate dueDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = Notification.builder()
            .user(user)
            .title("Due Date Reminder")
            .message("Your book '" + bookTitle + "' is due on " + dueDate.toString())
            .type(Notification.NotificationType.DUE_DATE_REMINDER)
            .read(false)
            .build();
        createNotification(notification);
    }

    public void createOverdueNotification(Long userId, String bookTitle, long daysOverdue) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = Notification.builder()
            .user(user)
            .title("Overdue Book")
            .message("Your book '" + bookTitle + "' is " + daysOverdue + " days overdue. Please return it as soon as possible.")
            .type(Notification.NotificationType.OVERDUE_ALERT)
            .read(false)
            .build();
        createNotification(notification);
    }
    public void checkDueDates() {
    // Get all active borrow records that are due soon or overdue
    List<BorrowRecord> dueRecords = borrowService.findDueAndOverdueRecords();
    
    for (BorrowRecord record : dueRecords) {
        LocalDate dueDate = record.getDueDate();
        LocalDate today = LocalDate.now();
        long daysUntilDue = java.time.temporal.ChronoUnit.DAYS.between(today, dueDate);
        long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(dueDate, today);
        
        // Get the user ID from the borrower relationship
        Long userId = record.getBorrower().getUser().getId();
        String bookTitle = record.getBook().getTitle();
        
        if (daysOverdue > 0) {
            // Book is overdue
            createOverdueNotification(userId, bookTitle, daysOverdue);
        } else if (daysUntilDue <= 2 && daysUntilDue >= 0) {
            // Book is due within 2 days
            createDueDateReminder(userId, bookTitle, dueDate);
        }
    }
     @Scheduled(cron = "0 0 9 * * ?") // Runs daily at 9:00 AM
    public void scheduledDueDateCheck() {
        checkDueDates();
    }
}