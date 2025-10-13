package org.chatbot.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * This entity represents a user in the system
 * Stores user account information and authentication details
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User's full name
    @Column(nullable = false)
    private String name;

    // user's email (will use for login
    @Column(nullable = false)
    private String email;

    // hashed password (>>NEVER store plain text passwords!!<<)
    @Column(nullable = false)
    private String passwordHash;

    // When the account was created
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // when the account was last updated
    private LocalDateTime updatedAt;

    // Relationships to other entities
    // One user can have many msg
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    private List<Message> messages;

    //one user can have many journal entries
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    private List<JournalEntry> journalEntries;

    // one user can have many mood logs
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL)
    private List<MoodLog> moodLogs;

    // constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = LocalDateTime.now();
    }

    //getters and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
