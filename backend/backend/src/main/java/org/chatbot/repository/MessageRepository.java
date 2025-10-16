package org.chatbot.repository;


import org.chatbot.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * This repository handles database operations for Message entity
 * Spring Data JPA automatically implements these methods
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Find all messages for a specific user, ordered by timestamp
     * this is used to fetch chat history
     * @param userId the user's ID
     * @return List of msg ordered from oldest to newest
     */
    List<Message> findByUserIdOrderByTimestampAsc(Long userId);

    /**
     * Find recent messages for a user (for context in AI conversation)
     * @param userId The user's ID
     * @return Last 10 messages
     */
    List<Message> findTop10ByUserIdOrderByTimestampDesc(Long userId);

    /**
     * Delete all messages for a specific user
     * Used when user deletes their account
     * @param userId The user's ID
     */
    void deleteByUserId(Long userId);
}
