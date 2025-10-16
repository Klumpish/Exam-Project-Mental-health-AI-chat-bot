package org.chatbot.repository;


import org.chatbot.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * this repository handles database operations for journalEntry entity
 */
@Repository
public interface JournalRepository extends JpaRepository<JournalEntry, Long> {

    /**
     * Find all journal entries for a user, ordered by date (newest first)
     * @param userId The user's ID
     * @return List of journal entries
     */
    List<JournalEntry> findByUserIdOrderByDateDesc(Long userId);

    /**
     * Find a specific journal entry by user and date
     * Useful to check if user already wrote an entry today
     * @param userId The user's ID
     * @param date The date to check
     * @return Optional containing the entry if it exists
     */
    Optional<JournalEntry> findByUserIdAndDate(Long userId, LocalDate date);

    /**
     * Delete all journal entries for a specific user
     * @param userId The user's ID
     */
    void deleteByUserId(Long userId);

    /**
     * Count total journal entries for a user
     * @param userId The user's ID
     * @return Number of entries
     */
    long countByUserId(Long userId);
}
