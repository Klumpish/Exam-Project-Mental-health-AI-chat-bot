package org.chatbot.service;


import org.chatbot.model.Message;
import org.chatbot.repository.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.net.http.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


/**
 * This service handles the business logic for chat funtionality
 * it communicates with OpenAI API and manages msg storage
 */
@Service
public class ChatService {

    //inject the msg repository for database operations
    @Autowired
    private MessageRepository messageRepository;

    //inject sentiment service for analyzing msg
    @Autowired
    private SentimentService sentimentService;

    //get openAI API Key from application.properties
    @Value("${openai.api.key}")
    private String openaiApiKey;

    // OpenAI API endpoint TODO:make sure the URL is valid they are doing updates
    private static final String OPENAI_API_URL =
      "https://api.openai" + ".com/v1/chat/completions";

    /**
     * Process a user msg: send to AI, analyze sentiment, save to database
     * @param userMessage the message text from the user
     * @return AI's response text
     */
    public String processMessage(String userMessage) {
        try {
            // step 1: Check msg for risk/crisis indicators
            boolean isRisky = sentimentService.detectRisk(userMessage);

            // step 2: Get AI response from OpenAI
            String aiResponse = getAIResponse(userMessage, isRisky);

            // step 3: save both messages to database
            saveMessage(userMessage, "user");
            saveMessage(aiResponse, "ai");

            return aiResponse;
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            // return a fallback message
            return "I'm having trouble connecting right now. Please try again in a" +
              " moment.";
        }
    }

    /**
     * Call OpenAI API to get AI response
     * @param userMessage the user's msg
     * @param isRisky whether the msg contains risk indicators
     * @return AI' response
     */
    private String getAIResponse(String userMessage, boolean isRisky) {
        try {
            // Create REST template for HTTP requests
            RestTemplate restTemplate = new RestTemplate();

            // Set up headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            //build the request body with system promt and user msg
            String systemPrompt = isRisky ? "You are a compassionate mental health" +
              " support assistant. The user may be in distress. Respond with " +
              "empathy and suggest professional resources if needed. Never provide" +
              " medical advice." : "You are a compassionate mental health support " +
              "assistant. Respond with empathy and understanding. Never provide " +
              "medical advice.";

            //TODO make sure to check correct max token,temp and model
            Map<String, Object> requestBody = Map.of("model", "gpt-4", "messages",
              List.of(Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)), "max_tokens", 150,
              "temperature", 0.7);

            //create HTTP entity with headers and body
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody,
              headers);

            // Send POST request to OpenAI
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_API_URL,
              HttpMethod.POST, entity, Map.class);

            // Extract AI response from JSON
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> choices =
              (List<Map<String, Object>>) responseBody.get(
              "choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, String> messages = (Map<String, String>) firstChoice.get(
              "messages");

            return messages.get("content");
        } catch (Exception e) {
            System.err.println("Error calling OpenAI API: " + e.getMessage());
            throw new RuntimeException("Failed to get AI response");
        }
    }


    /**
     * Save a message to the database
     * @param text the msg text
     * @param sender either "user" or "Ai"
     */
    private void saveMessage(String text, String sender) {
        Message message = new Message();
        message.setText(text);
        message.setSender(sender);
        message.setTimestamp(LocalDateTime.now());

        //todo remember to add authentication to userId

        messageRepository.save(message);
    }

    /**
     *  Get chat history for a specific user
     * @param userId the user's ID
     * @return list of msg
     */
    public List<Message> getChatHistory(Long userId) {
        return messageRepository.findByUserIdOrderByTimestampAsc(userId);
    }


}
