package org.chatbot.service;


import org.chatbot.model.JournalEntry;
import org.chatbot.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * this ervice handles business logic for journal entries
 * manages saving, retrieving and analyzing journal data
 */
@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    /**
     * Save a new journal entry
     * @param text the journal entry text
     * @param userId the user's ID
     * @return the saved journal entry
     */
    public JournalEntry saveEntry(String text, Long userId) {
        //validate input
        if (text == null || text.trim()
                                .isEmpty()) {
            throw new IllegalArgumentException("Journal entry cannot be empty");
        }

        // create new journal entry
        JournalEntry entry = new JournalEntry(text, userId);

        // save to database
        return journalRepository.save(entry);
    }


    /**
     * Get all journal entries for a user
     * @param userId the user's ID
     * @return List of journal entries (newest first)
     */
    public List<JournalEntry> getUserEntries(Long userId) {
        return journalRepository.findByUserIdOrderByDateDesc(userId);
    }

    /**
     * Get a specific journal entry by ID
     * @param entryId the entry id
     * @param userId the user's ID (for security check)
     * @return the journal entry if found and belongs to user
     */
    public Optional<JournalEntry> getEntry(Long entryId, Long userId) {
        Optional<JournalEntry> entry = journalRepository.findById(entryId);

        // Security check to make sure entry belongs to the user
        if (entry.isPresent() && !entry.get()
                                       .getUserId()
                                       .equals(userId)) {
            return Optional.empty(); // User doesn't own this entry
        }

        return entry;
    }

    /**
     * Update an existing journal entry
     * @param entryId the entry id to update
     * @param newText the new text
     * @param userId the user's id (for security)
     * @return updated entry
     */
    public JournalEntry updateEntry(Long entryId, String newText, Long userId) {
        //find existing entry
        Optional<JournalEntry> existingEntry = getEntry(entryId, userId);

        if (existingEntry.isEmpty()) {
            throw new IllegalArgumentException("Entry not found or access denied");
        }

        //update the text
        JournalEntry entry = existingEntry.get();
        entry.setText(newText);

        // save and return
        return journalRepository.save(entry);
    }

    /**
     * Delete a journal entry
     * @param entryId the entry id to delete
     * @param userId the user's ID (for security)
     */
    public void deleteEntry(Long entryId, Long userId) {
        //verify entry exists and belongs to user
        Optional<JournalEntry> entry = getEntry(entryId, userId);

        if (entry.isEmpty()) {
            throw new IllegalArgumentException("Entry not found or access denied");
        }

        //delete entry
        journalRepository.deleteById(entryId);
    }

    /**
     * Check if user has alread written an entry today
     * @param userId the users ID
     * @return true if entry exists for today
     */
    public boolean hasEntryToday(Long userId) {
        LocalDate today = LocalDate.now();
        return journalRepository.findByUserIdAndDate(userId, today)
                                .isPresent();
    }

    /**
     * get total count of entries for a user
     * @param userId the user's ID
     * @return Number of entries
     */
    public long getEntryCount(Long userId) {
        return journalRepository.countByUserId(userId);
    }

}
