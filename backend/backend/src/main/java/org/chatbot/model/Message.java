package org.chatbot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * This entity represents a chat message in the database
 * each msg has text, sender (user or ai), timestamp, and belongs to a user
 */

@Entity
@Table(name = "messages")
public class Message {

    // Primary key, auto-generated
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The actual msg text
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    // Who sent the msg: "user" or "ai"
    @Column(nullable = false)
    private String sender;

    // when the msg was sent
    @Column(nullable = false)
    private LocalDateTime timestamp;

    //Reference to the user who owns this msg
    @Column(name = "user_id")
    private long userId;

    // Default constructor
    public Message() {}

    public Message(String text, String sender, LocalDateTime timestamp,
                   long userId) {
        this.text = text;
        this.sender = sender;
        this.timestamp = timestamp;
        this.userId = userId;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Message{" + "id=" + id + ", sender='" + sender + '\'' +
          ", timestamp=" + timestamp + '}';
    }
}
