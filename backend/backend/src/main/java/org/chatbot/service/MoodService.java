package org.chatbot.service;

import org.chatbot.model.MoodLog;
import org.chatbot.repository.MoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * this service handles business logic for mood tracking
 * manages mood logs and provides analytics
 */
@Service
public class MoodService {

    @Autowired
    private MoodRepository moodRepository;

    /**
     * Save a mood log for today
     * @param mood Mood rating 1-5
     * @param userId the user's ID
     * @param notes Optional notes about the mood
     * @return the saved mood log
     */
    public MoodLog logMood(Integer mood, Long userId, String notes) {
        //validate mood is between 1 and 5
        if (mood < 1 || mood > 5) {
            throw new IllegalArgumentException("Mood must be between 1 and 5");
        }

        // Check if user already logged mood today
        LocalDate today = LocalDate.now();
        Optional<MoodLog> existingLog = moodRepository.findByUserIdAndDate(userId,
          today);

        MoodLog moodLog;
        if (existingLog.isPresent()) {
            // update existing mood log for today
            moodLog = existingLog.get();
            moodLog.setMood(mood);
            moodLog.setNote(notes);
        } else {
            //Create new mood log
            moodLog = new MoodLog(mood, userId);
            moodLog.setNote(notes);
        }

        // save and return
        return moodRepository.save(moodLog);
    }

    /**
     * Get all mood logs for a user
     * @param userId the user's ID
     * @return List of mood logs (newest first)
     */
    public List<MoodLog> getUserMoodLogs(Long userId) {
        return moodRepository.findByUserIdOrderByDateDesc(userId);
    }

    /**
     * Get mood logs for a specific date range
     * @param userId the user's ID
     * @param startDate start of range
     * @param endDate end of range
     * @return List of mood logs in that range
     */

    public List<MoodLog> getMoodLogsInRange(Long userId, LocalDate startDate,
                                            LocalDate endDate) {
        return moodRepository.findByUserIdAndDateBetweenOrderByDateAsc(userId,
          startDate, endDate);
    }

    /**
     * Get mood trends for the last 30 days
     * @param userId the user's ID
     * @return Map with trend analysis
     */
    public Map<String, Object> getMoodTrends(Long userId) {
        //get date 30 days ago
        LocalDate thirtyDaysAgo = LocalDate.now()
                                           .minusDays(30);

        // Get mood logs for last 30 days
        List<MoodLog> recentLogs = getMoodLogsInRange(userId, thirtyDaysAgo,
          LocalDate.now());

        // calculate average mood
        Double averageMood = moodRepository.getAverageMoodSince(userId,
          thirtyDaysAgo);

        // count days by mood level
        Map<Integer, Long> moodCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int mood = i;
            long count = recentLogs.stream()
                                   .filter(log -> log.getMood() == mood)
                                   .count();
            moodCounts.put(i, count);
        }

        // build response map
        Map<String, Object> trends = new HashMap<>();
        trends.put("averageMood", averageMood != null ? averageMood : 0.0);
        trends.put("totalDays", recentLogs.size());
        trends.put("moodDistribution", moodCounts);
        trends.put("recentLogs", recentLogs);

        return trends;
    }

    /**
     * Check if user has logged mood today
     * @param userId the user's ID
     * @return true if mood logged today
     */
    public boolean hasMoodLogToday(Long userId) {
        LocalDate today = LocalDate.now();
        return moodRepository.findByUserIdAndDate(userId, today)
                             .isPresent();
    }

    /**
     * Get today's mood log if it exists
     * @param userId the user's ID
     * @return Optional containing today's mood log
     */
    public Optional<MoodLog> getTodaysMood(Long userId) {
        LocalDate today = LocalDate.now();
        return moodRepository.findByUserIdAndDate(userId, today);
    }


}
