package org.chatbot.model;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * This entity represents a journal entry written by a user
 * Users can write daily reflections and save them
 */

@Entity
@Table(name = "journal_entries")
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //the journal entry text
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    // the date this entry is for
    @Column(nullable = false)
    private LocalDate date;

    // when this entry was created/saved
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // the user who wrote this entry
    @Column(name = "user_id", nullable = false)
    private Long userId;

    //constructors
    public JournalEntry() {
        this.createdAt = LocalDateTime.now();
        this.date = LocalDate.now();
    }

    public JournalEntry(String text, Long userId) {
        this.text = text;
        this.userId = userId;
        this.date = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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

    @Override
    public String toString() {
        return "JournalEntry{" + "id=" + id + ", date=" + date + ", createdAt=" +
          createdAt + '}';
    }
}
