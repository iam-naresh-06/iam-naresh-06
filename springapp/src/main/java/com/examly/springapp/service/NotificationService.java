package com.examly.springapp.service;

import com.examly.springapp.entity.BorrowRecord;
import com.examly.springapp.entity.Notification;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.NotificationRepository;
import com.examly.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final BorrowService borrowService;
    
    // Constants for notification settings
    private static final int DUE_DATE_REMINDER_DAYS = 2;
    private static final int MAX_NOTIFICATIONS_PER_USER = 50;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    /**
     * Get all notifications for a specific user ordered by creation date
     */
    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(Long userId) {
        log.debug("Fetching notifications for user ID: {}", userId);
        validateUserId(userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get only unread notifications for a specific user
     */
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        log.debug("Fetching unread notifications for user ID: {}", userId);
        validateUserId(userId);
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Get count of unread notifications for a specific user
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        log.debug("Getting unread count for user ID: {}", userId);
        validateUserId(userId);
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /**
     * Create and save a new notification
     */
    public Notification createNotification(Notification notification) {
        log.debug("Creating notification for user ID: {}", notification.getUser().getId());
        
        // Set creation time if not already set
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        
        // Clean up old notifications if user has too many
        cleanupOldNotifications(notification.getUser().getId());
        
        return notificationRepository.save(notification);
    }

    /**
     * Mark a specific notification as read
     */
    public void markAsRead(Long notificationId) {
        log.debug("Marking notification as read: {}", notificationId);
        
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            notificationRepository.markAsRead(notificationId);
            log.info("Notification {} marked as read", notificationId);
        } else {
            log.warn("Notification not found: {}", notificationId);
            throw new RuntimeException("Notification not found with ID: " + notificationId);
        }
    }

    /**
     * Mark all notifications as read for a specific user
     */
    public void markAllAsRead(Long userId) {
        log.debug("Marking all notifications as read for user ID: {}", userId);
        validateUserId(userId);
        notificationRepository.markAllAsRead(userId);
        log.info("All notifications marked as read for user ID: {}", userId);
    }

    /**
     * Delete a specific notification
     */
    public void deleteNotification(Long notificationId) {
        log.debug("Deleting notification: {}", notificationId);
        
        if (notificationRepository.existsById(notificationId)) {
            notificationRepository.deleteById(notificationId);
            log.info("Notification {} deleted successfully", notificationId);
        } else {
            log.warn("Attempted to delete non-existent notification: {}", notificationId);
            throw new RuntimeException("Notification not found with ID: " + notificationId);
        }
    }

    /**
     * Create a due date reminder notification
     */
    public void createDueDateReminder(Long userId, String bookTitle, LocalDate dueDate) {
        log.debug("Creating due date reminder for user ID: {}, book: {}", userId, bookTitle);
        
        User user = getUserById(userId);
        String formattedDate = dueDate.format(DATE_FORMATTER);
        
        // Check if we already sent a reminder for this book recently
        if (hasRecentNotification(userId, bookTitle, Notification.NotificationType.DUE_DATE_REMINDER)) {
            log.debug("Recent due date reminder already exists for user {} and book {}", userId, bookTitle);
            return;
        }
        
        Notification notification = Notification.builder()
            .user(user)
            .title("Due Date Reminder")
            .message("Your book '" + bookTitle + "' is due on " + formattedDate + ". Please return it on time to avoid late fees.")
            .type(Notification.NotificationType.DUE_DATE_REMINDER)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
            
        createNotification(notification);
        log.info("Due date reminder created for user ID: {}, book: {}", userId, bookTitle);
    }

    /**
     * Create an overdue book notification
     */
    public void createOverdueNotification(Long userId, String bookTitle, long daysOverdue) {
        log.debug("Creating overdue notification for user ID: {}, book: {}, days overdue: {}", userId, bookTitle, daysOverdue);
        
        User user = getUserById(userId);
        
        // Check if we already sent an overdue notification recently
        if (hasRecentNotification(userId, bookTitle, Notification.NotificationType.OVERDUE_ALERT)) {
            log.debug("Recent overdue notification already exists for user {} and book {}", userId, bookTitle);
            return;
        }
        
        String message = String.format(
            "Your book '%s' is %d day%s overdue. Please return it as soon as possible to avoid additional late fees. " +
            "Current late fee may apply at $0.50 per day.",
            bookTitle, 
            daysOverdue, 
            daysOverdue == 1 ? "" : "s"
        );
        
        Notification notification = Notification.builder()
            .user(user)
            .title("Overdue Book Alert")
            .message(message)
            .type(Notification.NotificationType.OVERDUE_ALERT)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
            
        createNotification(notification);
        log.info("Overdue notification created for user ID: {}, book: {}, days overdue: {}", userId, bookTitle, daysOverdue);
    }

    /**
     * Create a book reservation ready notification
     */
    public void createReservationReadyNotification(Long userId, String bookTitle) {
        log.debug("Creating reservation ready notification for user ID: {}, book: {}", userId, bookTitle);
        
        User user = getUserById(userId);
        
        Notification notification = Notification.builder()
            .user(user)
            .title("Reserved Book Available")
            .message("Your reserved book '" + bookTitle + "' is now available for pickup. Please collect it within 3 days to maintain your reservation.")
            .type(Notification.NotificationType.RESERVATION_READY)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
            
        createNotification(notification);
        log.info("Reservation ready notification created for user ID: {}, book: {}", userId, bookTitle);
    }

    /**
     * Create a new book arrival notification (for interested users)
     */
    public void createNewBookNotification(Long userId, String bookTitle, String author) {
        log.debug("Creating new book notification for user ID: {}, book: {}", userId, bookTitle);
        
        User user = getUserById(userId);
        
        Notification notification = Notification.builder()
            .user(user)
            .title("New Book Arrival")
            .message("A new book '" + bookTitle + "' by " + author + " has been added to our collection and is available for borrowing.")
            .type(Notification.NotificationType.NEW_BOOK_ARRIVAL)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
            
        createNotification(notification);
        log.info("New book notification created for user ID: {}, book: {}", userId, bookTitle);
    }

    /**
     * Create a system announcement notification
     */
    public void createSystemAnnouncement(Long userId, String title, String message) {
        log.debug("Creating system announcement for user ID: {}", userId);
        
        User user = getUserById(userId);
        
        Notification notification = Notification.builder()
            .user(user)
            .title(title)
            .message(message)
            .type(Notification.NotificationType.SYSTEM_ANNOUNCEMENT)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
            
        createNotification(notification);
        log.info("System announcement created for user ID: {}", userId);
    }

    /**
     * Create a fine notice notification
     */
    public void createFineNotification(Long userId, String bookTitle, double fineAmount) {
        log.debug("Creating fine notification for user ID: {}, fine amount: ${}", userId, fineAmount);
        
        User user = getUserById(userId);
        
        String message = String.format(
            "A fine of $%.2f has been applied to your account for the overdue book '%s'. " +
            "Please pay this fine at your earliest convenience.",
            fineAmount, bookTitle
        );
        
        Notification notification = Notification.builder()
            .user(user)
            .title("Fine Notice")
            .message(message)
            .type(Notification.NotificationType.FINE_NOTICE)
            .read(false)
            .createdAt(LocalDateTime.now())
            .build();
            
        createNotification(notification);
        log.info("Fine notification created for user ID: {}, amount: ${}", userId, fineAmount);
    }

    /**
     * Scheduled task to check for due dates and send automatic notifications
     * Runs every day at 9:00 AM
     */
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void checkDueDates() {
        log.info("Starting scheduled due date check at {}", LocalDateTime.now());
        
        try {
            List<BorrowRecord> dueRecords = borrowService.findDueAndOverdueRecords();
            log.info("Found {} records due for notification check", dueRecords.size());
            
            int remindersCreated = 0;
            int overdueAlertsCreated = 0;
            
            for (BorrowRecord record : dueRecords) {
                try {
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
                        overdueAlertsCreated++;
                    } else if (daysUntilDue <= DUE_DATE_REMINDER_DAYS && daysUntilDue >= 0) {
                        // Book is due within reminder period
                        createDueDateReminder(userId, bookTitle, dueDate);
                        remindersCreated++;
                    }
                } catch (Exception e) {
                    log.error("Error processing borrow record ID: {}", record.getId(), e);
                }
            }
            
            log.info("Due date check completed. Created {} due date reminders and {} overdue alerts", 
                     remindersCreated, overdueAlertsCreated);
                     
        } catch (Exception e) {
            log.error("Error during scheduled due date check", e);
        }
    }

    /**
     * Manual trigger for due date checking (for admin use)
     */
    public void manualDueDateCheck() {
        log.info("Manual due date check triggered");
        checkDueDates();
    }

    /**
     * Send bulk notifications to multiple users
     */
    public void sendBulkSystemAnnouncement(List<Long> userIds, String title, String message) {
        log.info("Sending bulk system announcement to {} users", userIds.size());
        
        for (Long userId : userIds) {
            try {
                createSystemAnnouncement(userId, title, message);
            } catch (Exception e) {
                log.error("Failed to send announcement to user ID: {}", userId, e);
            }
        }
        
        log.info("Bulk system announcement completed");
    }

    // Helper Methods

    /**
     * Validate if user ID exists
     */
    private void validateUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    /**
     * Get user by ID with proper error handling
     */
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    /**
     * Check if user has received a recent notification of the same type for the same book
     */
    private boolean hasRecentNotification(Long userId, String bookTitle, Notification.NotificationType type) {
        // Check for notifications created in the last 24 hours
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        
        List<Notification> recentNotifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> n.getCreatedAt().isAfter(oneDayAgo))
                .filter(n -> n.getType() == type)
                .filter(n -> n.getMessage().contains(bookTitle))
                .toList();
        
        return !recentNotifications.isEmpty();
    }

    /**
     * Clean up old notifications if user has too many
     */
    private void cleanupOldNotifications(Long userId) {
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        if (userNotifications.size() >= MAX_NOTIFICATIONS_PER_USER) {
            // Keep only the most recent notifications and delete the rest
            List<Notification> toDelete = userNotifications
                    .stream()
                    .skip(MAX_NOTIFICATIONS_PER_USER - 10) // Keep 40 notifications, delete the rest
                    .toList();
            
            notificationRepository.deleteAll(toDelete);
            log.info("Cleaned up {} old notifications for user ID: {}", toDelete.size(), userId);
        }
    }

    /**
     * Get notification statistics for admin dashboard
     */
    @Transactional(readOnly = true)
    public NotificationStats getNotificationStats() {
        long totalNotifications = notificationRepository.count();
        // You might need to add more specific queries in the repository for these stats
        
        return NotificationStats.builder()
                .totalNotifications(totalNotifications)
                .build();
    }

    /**
     * Inner class for notification statistics
     */
    public static class NotificationStats {
        private final long totalNotifications;
        private final long unreadNotifications;
        private final long dueDateReminders;
        private final long overdueAlerts;

        // Using Lombok @Builder pattern
        public static NotificationStatsBuilder builder() {
            return new NotificationStatsBuilder();
        }

        private NotificationStats(NotificationStatsBuilder builder) {
            this.totalNotifications = builder.totalNotifications;
            this.unreadNotifications = builder.unreadNotifications;
            this.dueDateReminders = builder.dueDateReminders;
            this.overdueAlerts = builder.overdueAlerts;
        }

        // Getters
        public long getTotalNotifications() { return totalNotifications; }
        public long getUnreadNotifications() { return unreadNotifications; }
        public long getDueDateReminders() { return dueDateReminders; }
        public long getOverdueAlerts() { return overdueAlerts; }

        public static class NotificationStatsBuilder {
            private long totalNotifications;
            private long unreadNotifications;
            private long dueDateReminders;
            private long overdueAlerts;

            public NotificationStatsBuilder totalNotifications(long totalNotifications) {
                this.totalNotifications = totalNotifications;
                return this;
            }

            public NotificationStatsBuilder unreadNotifications(long unreadNotifications) {
                this.unreadNotifications = unreadNotifications;
                return this;
            }

            public NotificationStatsBuilder dueDateReminders(long dueDateReminders) {
                this.dueDateReminders = dueDateReminders;
                return this;
            }

            public NotificationStatsBuilder overdueAlerts(long overdueAlerts) {
                this.overdueAlerts = overdueAlerts;
                return this;
            }

            public NotificationStats build() {
                return new NotificationStats(this);
            }
        }
    }
}