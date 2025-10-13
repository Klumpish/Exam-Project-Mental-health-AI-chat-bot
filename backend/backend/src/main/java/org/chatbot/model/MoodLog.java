package org.chatbot.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * this entity represents a daily mood log entry
 * users rate their mood from 1 (very bad) to 5 (great)
 */
@Entity
@Table(name = "mood_logs")
public class MoodLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mood rating 1 - 5, very bad to great
    @Column(nullable = false)
    private Integer mood;

    // the date this mood log is for
    @Column(nullable = false)
    private LocalDate date;

    // when this mood was logged
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // the user who logged this mood
    @Column(name = "user_id", nullable = false)
    private Long userId;

    //Optional notes about the mood
    @Column(columnDefinition = "TEXT")
    private String note;

    // constructors
    public MoodLog() {
        this.createdAt = LocalDateTime.now();
        this.date = LocalDate.now();
    }

    public MoodLog(Integer mood, Long userId) {
        this.mood = mood;
        this.userId = userId;
        this.date = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }

    // getters and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMood() {
        return mood;
    }

    public void setMood(Integer mood) {
        //Validate mood is between 1-5
        if (mood < 1 || mood > 5) {
            throw new IllegalArgumentException("Mood must be between 1 and 5");
        }
        this.mood = mood;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public String toString() {
        return "MoodLog{" + "id=" + id + ", mood=" + mood + ", date=" + date + '}';
    }
}
