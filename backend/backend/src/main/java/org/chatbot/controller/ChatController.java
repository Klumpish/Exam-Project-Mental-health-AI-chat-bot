package org.chatbot.controller;

import org.chatbot.model.Message;
import org.chatbot.service.AuthService;
import org.chatbot.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for chat endpoints
 * uses JWT authentication to get the current user
 */

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
//allow request from frontend
public class ChatController {

      // Inject the ChatService to handle business logic
      @Autowired
      private ChatService chatService;

      @Autowired
      private AuthService authService;

      /**
       * POST endpoint to send a msg and get AI response
       * URL: "/api/chat"
       * Requires authentication
       * Receives: { "message": "user's message text", "timestamp": "ISO
       * date" }
       * Returns: { "text": "AI response", "timestamp": "ISO date" }
       */
      @PostMapping
      public ResponseEntity<?> sendMessage(
              @RequestBody Map<String, String> payload,
              @RequestHeader("Authorization") String token ) {
            try {
                  //Extract msg text from request body
                  String userMessage = payload.get( "message" );

                  //validate that msg is not empty
                  if ( userMessage == null || userMessage.trim()
                          .isEmpty() ) {
                        return ResponseEntity.badRequest()
                                .body( Map.of( "error",
                                        "Message cannot be empty" ) );
                  }

                  //Get user ID from JWT Token
                  Long userId = authService.getUserIdFromToken( token );
                  System.out.println( " Chat message from user ID: " + userId );


                  // Process message
                  String aiResponse = chatService.processMessage( userMessage,
                          userId );

                  // Return AI response with timestamp
                  return ResponseEntity.ok( Map.of(
                          "text", aiResponse,
                          "timestamp", java.time.LocalDateTime.now()
                                  .toString()
                  ) );

            } catch ( Exception e ) {
                  // log error and return error response
                  System.err.println( "Error in sendMessage: " + e.getMessage() );
                  e.printStackTrace();
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to process message: " + e.getMessage() ) );
            }
      }

      /**
       * Get chat history for authenticated user
       */
      @GetMapping("/history")
      public ResponseEntity<?> getChatHistory( @RequestHeader("Authorization") String token ) {
            try {
                  // Get user ID from JWT token
                  Long userId = authService.getUserIdFromToken( token );
                  System.out.println( " Fetching chat history for user ID: " + userId );

                  // fetch chat history from database
                  List<Message> history = chatService.getChatHistory( userId );

                  return ResponseEntity.ok( history );

            } catch ( Exception e ) {
                  System.err.println( " Error fetching chat history: " + e.getMessage() );
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Failed to fetch chat history" ) );
            }
      }


}
