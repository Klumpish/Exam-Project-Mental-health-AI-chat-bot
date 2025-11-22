package org.chatbot.service;


import org.chatbot.AiService.GPT4ALLApiService;

import org.chatbot.model.Message;
import org.chatbot.repository.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;


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

    //using GPT4ALL instead of OpenAI
    @Autowired
    private GPT4ALLApiService gpt4ALLApiService;


    /**
     * Process a user msg: send to AI, analyze sentiment, save to database
     * @param userMessage the message text from the user
     * @return AI's response text
     */

    //TODO for testing we are accepting userId
    public String processMessage(String userMessage, Long userId) {
        try {
            // step 1: Check msg for risk/crisis indicators
            boolean isRisky = sentimentService.detectRisk(userMessage);

            // step 2: Get AI response from GPT4All
            String aiResponse = getAIResponse(userMessage, isRisky);

            // step 3: save both messages to database
            saveMessage(userMessage, "user", userId);
            saveMessage(aiResponse, "ai", userId);

            return aiResponse;

        } catch (Exception e) {
            System.err.println(
              "Error processing message: " + e.getMessage());
            // return a fallback message
            return
              "I'm having trouble connecting right now. Please try again" +
                " in a" + " moment.";
        }
    }

    /**
     * Get AI response using GPT4All API
     * @param userMessage the user's msg
     * @param isRisky whether the msg contains risk indicators
     * @return AI' response
     */
    private String getAIResponse(String userMessage, boolean isRisky) {
        try {
            // Check if GPT4All is ready
            if (!gpt4ALLApiService.isApiAvailable()) {
                return
                  "⚠️ AI service is not available. Please make sure " +
                    "GPT4All is running with the API server enabled " +
                    "(Settings > Application > Enable Local API Server).";
            }


            //build the request body with system promt and user msg
            String systemPrompt = isRisky ? """
                                            You are a compassionate mental health support assistant.
                                            The user may be in emotional distress.
                                            Respond briefly with empathy and understanding.
                                            If appropriate, suggest professional mental health resources or reaching out to trusted people.
                                            Never provide medical advice. Limit your reply to 100 words.
                                            """ : """
                                                  You are a compassionate mental health support assistant.
                                                  Respond briefly with empathy and understanding.
                                                  Never provide medical advice. Limit your reply to 100 words.
                                                  """;
            //Generate response using GPT4All
            String aiResponse = gpt4ALLApiService.generateResponse(
              userMessage, systemPrompt);

            //if response indicates crisis, add resources
            if (isRisky) {
                aiResponse +=
                  "\n\n" + sentimentService.getCrisisResources();
            }

            return aiResponse;


        } catch (Exception e) {
            System.err.println(
              "Error getting AI response: " + e.getMessage());
            e.printStackTrace();
            return "I'm here to listen. I'm having a brief technical " +
              "difficulty, but " +
              "please know that your wellbeing matters. " +
              "If you're in crisis, please reach out to a crisis " +
              "hotline or " + "emergency services.";
        }
    }


    /**
     * Save a message to the database
     * @param text the msg text
     * @param sender either "user" or "Ai"
     */
    //TODO accept userId while testing
    private void saveMessage(String text, String sender, Long userId) {
        Message message = new Message();
        message.setText(text);
        message.setSender(sender);
        message.setTimestamp(LocalDateTime.now());
        //todo while tesitng
        message.setUserId(userId);

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
