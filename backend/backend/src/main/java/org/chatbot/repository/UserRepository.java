package org.chatbot.repository;

import org.chatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity
 * Handles database operations for users
 */
@Repository
public interface UserRepository  extends JpaRepository<User, Long> {
      /**
       * Find user by email (used for login)
       * @param email User's email
       * @return Optional containing user if found
       */
      Optional<User> findByEmail(String email);

      /**
       * Check if user with given email already exists (used for registration)
       * @param email Email to check
       * @return true if email exists
       */
      boolean existsByEmail(String email);

}
