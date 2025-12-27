package org.chatbot.controller;


import org.chatbot.model.JournalEntry;
import org.chatbot.service.AuthService;
import org.chatbot.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for journal endpoints
 * uses JWT authentication to get the current user
 * provides endpoints for creating, reading, updating, and deleting journal entries
 */
@RestController
@RequestMapping("/api/journal")
@CrossOrigin(origins = "http://localhost:3000")
public class JournalController {

      @Autowired
      private JournalService journalService;

      @Autowired
      private AuthService authService;

      /**
       * POST endpoint to save a new journal entry
       * URL: /api/journal
       * Body: {"text": "journal entry text"}
       */
      @PostMapping
      public ResponseEntity<?> saveEntry(
              @RequestBody Map<String, String> payload,
              @RequestHeader("Authorization") String token ) {
            try {
                  String text = payload.get( "text" );

                  //validate input
                  if ( text == null || text.trim()
                          .isEmpty() ) {
                        return ResponseEntity.badRequest()
                                .body( Map.of(
                                        "error", "Journal entry cannot be empty" ) );
                  }


                  Long userId = authService.getUserIdFromToken( token );
                  System.out.println( " Saving journal entry for user ID: " + userId );

                  //save the entry
                  JournalEntry entry = journalService.saveEntry( text, userId );

                  return ResponseEntity.ok( entry );

            } catch ( Exception e ) {
                  System.err.println( "Error saving journal entry: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to save journal entry" ) );
            }
      }

      /**
       * GET endpoint to fetch all journal entries for user
       * URL: /api/journal
       */
      @GetMapping
      public ResponseEntity<?> getUserEntries( @RequestHeader("Authorization") String token ) {
            try {

                  Long userId = authService.getUserIdFromToken( token );
                  System.out.println( " Fetching journal entries for user ID: " + userId );

                  List<JournalEntry> entries = journalService.getUserEntries( userId );

                  return ResponseEntity.ok( entries );

            } catch ( Exception e ) {
                  System.err.println( "Error fetching Journal entries: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to fetch journal entries" ) );
            }
      }

      /**
       * PUT endpoint to update an existing journal entry
       * URL: /api/journal/{id}
       * body: {"text": "updated text}
       */
      @PutMapping("/{id}")
      public ResponseEntity<?> updateEntry(
              @PathVariable long id,
              @RequestBody Map<String, String> payload,
              @RequestHeader("Authorization") String token ) {
            try {
                  String newText = payload.get( "text" );
                  Long userId = authService.getUserIdFromToken( token );

                  JournalEntry updated = journalService.updateEntry( id, newText, userId );

                  return ResponseEntity.ok( updated );

            } catch ( IllegalArgumentException e ) {
                  return ResponseEntity.badRequest()
                          .body( Map.of( "error", e.getMessage() ) );

            } catch ( Exception e ) {
                  System.err.println( "Error updating journal entry: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to update journal entry" ) );
            }
      }

      /**
       * Delete endpoint to delete a journal entry
       * URL: /api/journal/{id}
       */
      @DeleteMapping("/{id}")
      public ResponseEntity<?> deleteEntry(
              @PathVariable long id,
              @RequestHeader("Authorization") String token ) {
            try {
                  Long userId = authService.getUserIdFromToken( token );

                  journalService.deleteEntry( id, userId );

                  return ResponseEntity.ok( Map.of( "message", "Entry deleted successfully" ) );

            } catch ( IllegalArgumentException e ) {
                  return ResponseEntity.badRequest()
                          .body( Map.of( "error", e.getMessage() ) );
            } catch ( Exception e ) {
                  System.err.println( "Error deleting journal entry: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to delete journal entry" ) );
            }
      }

      /**
       * GET endpoint to get entry count
       * URL: /api/journal/count
       */
      @GetMapping("/count")
      public ResponseEntity<?> getEntryCount( @RequestHeader("Authorization") String token ) {
            try {
                  Long userId = authService.getUserIdFromToken( token );

                  long count = journalService.getEntryCount( userId );

                  return ResponseEntity.ok( Map.of( "count", count ) );
            } catch ( Exception e ) {
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to get entry count" ) );
            }
      }

}
