package org.chatbot.AiService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for interacting with GPT4All Local API Server
 * Uses the OpenAI-compatible API running on localhost:4891
 */
@Service
public class GPT4ALLApiService {
    @Value("${gpt4all.api.url}")
    private String apiUrl;

    @Value("${gpt4all.model.name}")
    private String modelName;

    @Value("${ai.max.tokens:150}")
    private int maxTokens;

    @Value("${ai.temperature:0.7}")
    private double temperature;

    private final RestTemplate restTemplate;

    public GPT4ALLApiService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Generate AI response using GPT4All API Server
     * @param userMessage The user's message
     * @param systemPrompt The system prompt to guide AI behavior
     * @return AI's response
     */

    public String generateResponse(String userMessage,
                                   String systemPrompt) {
        try {
            System.out.println("Calling GPT4ALL API at: " + apiUrl);

            //build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", temperature);

            //build msg array with system prompt and user msg
            List<Map<String, String>> messages = List.of(
              Map.of("role", "system", "content", systemPrompt),
              Map.of("role", "user", "content", userMessage));
            requestBody.put("messages", messages);

            //set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
              requestBody, headers);

            // make POST request to GPT4ALL API
            String endpoint = apiUrl + "/chat/completions";
            ResponseEntity<Map> response = restTemplate.exchange(endpoint,
                                                                 HttpMethod.POST,
                                                                 entity,
                                                                 Map.class);

            //extract AI response from JSON
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null &&
              responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String,
                  Object>>) responseBody.get(
                  "choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, String> message =
                      (Map<String, String>) firstChoice.get(
                      "message");
                    String content = message.get("content");

                    System.out.println("Received response from GPT4ALL");
                    return content.trim();
                }
            }

            return "I'm not sure how to respond to that right now.";
        } catch (Exception e) {
            System.err.println(
              "Error calling GPT4ALL API: " + e.getMessage());
            e.printStackTrace();

            //check if api server is running
            if (e.getMessage()
                 .contains("Connection refused") || e.getMessage()
                                                     .contains(
                                                       "ConnectException"
                                                     )) {
                return "⚠️ Cannot connect to AI service. Please make " +
                  "sure GPT4All is running with API server enabled " +
                  "(Settings > Enable Local API Server).";
            }

            return "I apologize, but i'm having trouble generating a " +
              "response right now. Please try again.";
        }
    }

    /**
     * Check if GPT4ALL API is available
     * @return true if api is reachable
     */
    public boolean isApiAvailable() {
        try {
            String endpoint = apiUrl + "/models";
            ResponseEntity<String> response = restTemplate.getForEntity(
              endpoint, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            System.err.println(
              "GPT4ALL API is not available " + e.getMessage());
            return false;
        }
    }

    /**
     * Get list of available models from GPT4ALL
     * @return List of model names
     */
    public List<String> getAvailableModels() {
        try {
            String endpoint = apiUrl + "/models";
            ResponseEntity<Map> response = restTemplate.getForEntity(
              endpoint, Map.class);

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("data")) {
                List<Map<String, Object>> models = (List<Map<String,
                  Object>>) body.get(
                  "data");
                return models.stream()
                             .map(model -> (String) model.get("id"))
                             .toList();
            }
        } catch (Exception e) {
            System.err.println("Error fetching models: " + e.getMessage());
        }
        return List.of();
    }

    /**
     * Get current configuration info
     */
    public String getConfigInfo() {
        return String.format(
          "API URL: %s, Model: %s, Max Tokens: %d, Temperature: %.2f",
          apiUrl, modelName, maxTokens, temperature);
    }


}
