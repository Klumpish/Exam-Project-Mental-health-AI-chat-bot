package org.chatbot.controller;

import org.chatbot.model.MoodLog;
import org.chatbot.service.AuthService;
import org.chatbot.service.MoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * this controller handles all mood tracking HTTP requests
 * Provides endpoints for logging mood and viewing trends
 */
@RestController
@RequestMapping("/api/mood")
@CrossOrigin(origins = "http://localhost:3000")
public class MoodController {

      @Autowired
      private MoodService moodService;

      @Autowired
      private AuthService authService;

      /**
       * POST: endpoint to log daily mood
       * URL: {@code /api/mood}
       * Body: {@code {"mood": 1-5, "notes": "optional notes"}}
       */
      @PostMapping
      public ResponseEntity<?> logMood(
              @RequestBody Map<String, Object> payload,
              @RequestHeader("Authorization") String token ) {
            try {
                  //Extract mood rating from request
                  Integer mood = null;
                  Object moodObj = payload.get( "mood" );

                  if ( moodObj instanceof Integer ) {
                        mood = ( Integer ) moodObj;
                  } else if ( moodObj instanceof String ) {
                        mood = Integer.parseInt( ( String ) moodObj );
                  }

                  /*extract optional notes from request*/
                  String notes = ( String ) payload.get( "notes" );

                  //validate mood value
                  if ( mood == null || mood < 1 || mood > 5 ) {
                        return ResponseEntity.badRequest()
                                .body( Map.of( "error", "Mood must be between 1 and 5" ) );
                  }

                  // Get user ID from JWT Token
                  Long userId = authService.getUserIdFromToken( token );
                  System.out.println( " Logging mood for user ID: " + userId );

                  //save mood log with notes
                  MoodLog moodLog = moodService.logMood( mood, userId, notes );

                  return ResponseEntity.ok( moodLog );

            } catch ( Exception e ) {
                  System.err.println( "Error logging mood: " + e.getMessage() );
                  e.printStackTrace();
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to log mood: " + e.getMessage() ) );
            }
      }

      /**
       * GET endpoint to fetch all mood logs for user
       * URL: /api/mood
       */
      @GetMapping
      public ResponseEntity<?> getUserMoodLogs( @RequestHeader("Authorization") String token ) {
            try {
                  Long userId = authService.getUserIdFromToken( token );
                  System.out.println( " Fetching mood logs for user ID: " + userId );

                  List<MoodLog> moodLogs = moodService.getUserMoodLogs( userId );

                  return ResponseEntity.ok( moodLogs );

            } catch ( Exception e ) {
                  System.err.println( "Error fetching mood logs: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to fetch mood logs" ) );
            }
      }

      /**
       * GET endpoint to fetch mood trends (last 30 days)
       * URL: /api/mood/trends
       */
      @GetMapping("/trends")
      public ResponseEntity<?> getMoodTrends( @RequestHeader("Authorization") String token ) {
            try {
                  Long userId = authService.getUserIdFromToken( token );

                  Map<String, Object> trends = moodService.getMoodTrends( userId );

                  return ResponseEntity.ok( trends );

            } catch ( Exception e ) {
                  System.err.println( "Error fetching mood trends: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to fetch mood trends" ) );
            }
      }

      /**
       * GET endpoint to check if user has logged mood today
       * URL: <b>/api/mood/today</b>
       */
      @GetMapping("/today")
      public ResponseEntity<?> getTodaysMood( @RequestHeader("Authorization") String token ) {
            try {
                  Long userId = authService.getUserIdFromToken( token );

                  return moodService.getTodaysMood( userId )
                          .<ResponseEntity<Object>>map( ResponseEntity::ok )
                          .orElseGet( () -> ResponseEntity.ok( Map.of( "message", "No mood logged today" ) ) );
            } catch ( Exception e ) {
                  System.err.println( "Error fetching today's mood: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to fetch today's mood" ) );
            }

      }

}
