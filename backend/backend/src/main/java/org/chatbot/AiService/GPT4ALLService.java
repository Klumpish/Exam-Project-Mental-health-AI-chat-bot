package org.chatbot.AiService;

import com.hexadevlabs.gpt4all.LLModel;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

/**
 * Service for interacting with GPT4ALL local AI model
 * Uses Mistral instruct model running locally
 */

@Service
public class GPT4ALLService {

    @Value("${gpt4all.model.path}")
    private String modelPath;

    @Value("${gpt4all.model.name}")
    private String modelName;

    @Value("${gpt4all.max.tokens:150}")
    private int maxTokens;

    @Value("${gpt4all.temperature:0.7}")
    private double temperature;

    private LLModel model;

    /**
     * Initialize the GPT4All model when the service starts
     */
    @PostConstruct
    public void init() {
        try {
            System.out.println("--> Loading GPT4All model from: " + modelPath);

            Path path = Paths.get(modelPath);

            //Load the model
            model = new LLModel(path);

            System.out.println("--> Loaded GPT4All model: " + modelName);

        } catch (Exception e) {
            System.err.println(
              "--> X Failed to load GPT4All model: " + e.getMessage());
            throw new RuntimeException("Could not load GPT4All model: " + e);
        }
    }

    /**
     * Generate AI response using GPT4All
     * @param userMessage The user's message
     * @param systemPrompt the system prompt to guide AI behavior
     * @return AI's response
     */

    public String generateResponse(String systemPrompt, String userMessage) {
        try {
            //build the prompt with system context
            String fullPrompt = buildPrompt(systemPrompt, userMessage);

            System.out.println(
              "Generating response for promt length: " + fullPrompt.length());

            //Configure generation parameters
            LLModel.GenerationConfig config = LLModel.config()
                                                     .withNPredict(maxTokens)
                                                     .withTemp((float) temperature)
                                                     .withTopK(40)
                                                     .withTopP(0.9f)
                                                     .build();

            //Generate response
            String response = model.generate(fullPrompt, config);

            //Clean up the response
            response = cleanResponse(response);

            System.out.println(
              "--> Generated response length: " + response.length());

            return response;
        } catch (Exception e) {
            System.err.println("Error generating response: " + e.getMessage());
            e.printStackTrace();
            return "I apologize, but i'm having trouble generating a response " +
              "right now";
        }
    }

    /**
     * Build a properly formatted prompt for Mistral Instruct
     * Mistral uses a specific format for system/user messages
     */
    private String buildPrompt(String systemPrompt, String userMessage) {
        // Mistral Instruct format:
        // <s>[INST] System prompt
        // User message [/INST]

        StringBuilder prompt = new StringBuilder();
        prompt.append("<s>[INST] ");
        prompt.append(systemPrompt);
        prompt.append("\n\n");
        prompt.append(userMessage);
        prompt.append(" [/INST]");

        return prompt.toString();
    }

    /**
     * Clean up the AI response
     * Remove any prompt artifacts or extra formatting
     */
    private String cleanResponse(String response) {
        if (response == null) {
            return "I'm not sure how to respond to that.";
        }

        // Trim whitespace
        response = response.trim();

        // Remove common artifacts from model output
        response = response.replaceAll("\\[INST\\]", "");
        response = response.replaceAll("\\[/INST\\]", "");
        response = response.replaceAll("<s>", "");
        response = response.replaceAll("</s>", "");

        // If response is empty after cleaning, provide default
        if (response.isEmpty()) {
            return "I understand you're reaching out. Could you tell me more about" +
              " what's on your mind?";
        }

        return response;
    }

    /**
     * Clean up resources when service is destroyed
     */
    @PreDestroy
    public void cleanup() {
        try {
            if (model != null) {
                model.close();
                System.out.println("--> GPT4All model closed successfully");
            }
        } catch (Exception e) {
            System.err.println("Error closing GPT4All model: " + e.getMessage());
        }
    }

    /**
     * Check if the model is loaded and ready
     */
    public boolean isReady() {
        return model != null;
    }

    /**
     * Get model information
     */
    public String getModelInfo() {
        return String.format("Model: %s, Max Tokens: %d, Temperature: %.2f",
          modelName, maxTokens, temperature);
    }
}
