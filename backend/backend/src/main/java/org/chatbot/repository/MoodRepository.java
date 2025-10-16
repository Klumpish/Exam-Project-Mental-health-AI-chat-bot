package org.chatbot.repository;

import org.chatbot.model.MoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * this repository handles database operations for MoodLog entity
 */
@Repository
public interface MoodRepository extends JpaRepository<MoodLog, Long> {

    /**
     * Find all mood logs for a user, ordered by date
     * Used to show mood history and trends
     * @param userId The user's ID
     * @return List of mood logs
     */
    List<MoodLog> findByUserIdOrderByDateDesc(Long userId);

    /**
     * Find mood log for a specific user and date
     * Check if user already logged mood today
     * @param userId The user's ID
     * @param date The date to check
     * @return Optional containing the mood log if it exists
     */
    Optional<MoodLog> findByUserIdAndDate(Long userId, LocalDate date);

    /**
     * Find mood logs within a date range
     * Used for analytics and trend charts
     * @param userId The user's ID
     * @param startDate Start of date range
     * @param endDate End of date range
     * @return List of mood logs in that range
     */
    List<MoodLog> findByUserIdAndDateBetweenOrderByDateAsc(Long userId,
                                                           LocalDate startDate,
                                                           LocalDate endDate);

    /**
     * Calculate average mood for a user over
     * last 30 days Used for analythics dashboard
     * @param userId the user's ID
     * @param startDate 30 days ago
     * @return Average mood
     * as a double
     */
    @Query("SELECT AVG(m" + ".mood) FROM MoodLog " + "m WHERE m.userId = " +
      "?1 and m.date >=?2")
    Double getAverageMoodSince(Long userId, LocalDate startDate);

    /**
     * Delete all mood logs for a specific user
     * @param userId the user's ID
     */
    void deleteByUserId(Long userId);
}
