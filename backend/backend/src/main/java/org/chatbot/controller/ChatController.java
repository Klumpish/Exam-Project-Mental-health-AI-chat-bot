package org.chatbot.controller;

import org.chatbot.model.Message;
import org.chatbot.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * this controller handles all chat-related HTTP requests
 * it receives msg from frontend and sends them to the AI service
 */

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
//allow request from frontend
public class ChatController {

    // Inject the ChatService to handle business logic
    @Autowired
    private ChatService chatService;

    /**
     * POST endpoint to send a msg and get AI response
     * URL: "/api/chat"
     * Receives: { "message": "user's message text", "timestamp": "ISO
     * date" }
     * Returns: { "text": "AI response", "timestamp": "ISO date" }
     */
    @PostMapping
    public ResponseEntity<?> sendMessage(
      @RequestBody Map<String, String> payload) {
        try {
            //Extract msg text from request body
            String userMessage = payload.get("message");

            //validate that msg is not empty
            if (userMessage == null || userMessage.trim()
                                                  .isEmpty()) {
                return ResponseEntity.badRequest()
                                     .body(Map.of("error",
                                                  "Message cannot be " +
                                                    "empty"));
            }

            //TODO: userId temp hardcoded for testing
            Long userId = 1L;

            // Send msg to AI service and get response
            //TODO replace with GPT4ALLService for free service
            String aiResponse = chatService.processMessage(userMessage,
                                                           userId);
//            String aiResponse = GPT4ALLService.getAIResponse
//            (userMessage);


            // Return AI response with timestamp
            return ResponseEntity.ok(
              Map.of("text", aiResponse, "timestamp",
                     java.time.LocalDateTime.now()
                                            .toString()));

        } catch (Exception e) {
            // log error and return error response
            System.err.println("Error in sendMessage: " + e.getMessage());
            return ResponseEntity.internalServerError()
                                 .body(Map.of("error",
                                              "Failed to process " +
                                                "message"));
        }
    }


    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory() {
        try {
            //TODO:Get user ID from authentication context
            Long userId = 1L; // TODO: get from authentication

            // fetch chat history from database
            List<Message> history = chatService.getChatHistory(userId);

            return ResponseEntity.ok(history);
        } catch (Exception e) {
            System.err.println(
              "Error fetching chat history: " + e.getMessage());
            return ResponseEntity.internalServerError()
                                 .body(Map.of("error",
                                              "Failed to fetch chat " +
                                                "history"));
        }
    }


}
