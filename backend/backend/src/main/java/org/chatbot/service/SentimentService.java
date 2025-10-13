package org.chatbot.service;


import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * This service analyzes msg for crisis indicators and harmful content
 * it helps identify when users may need immediate professional help
 */
@Service
public class SentimentService {

    //TODO will have to update this as things progress, will ' be a problem?
    //keywords that indicate potential crisis or self-harm
    private static final List<String> CRISIS_KEYWORDS = Arrays.asList("suicide",
      "kill myself", "end my life", "want to die", "hurt myself", "self harm",
      "cut myself", "overdose", "no reason to live", "better off dead",
      "can't go on");

    //keywords indicating severe distress
    private static final List<String> DISTRESS_KEYWORDS = Arrays.asList("hopeless",
      "worthless", "can't take it", "give up", "no point", "too much", "can't cope",
      "breaking down");

    /**
     * Detect if a message contains crisis or self-harm indicators
     * @param message the msg text to analyze
     * @return true if message contains risk indicators
     */
    public boolean detectRisk(String message) {
        // Convert to lowercase for case-insensitive matching
        String lowerMessage = message.toLowerCase();

        //check for crisis keywords
        for (String keyword : CRISIS_KEYWORDS) {
            if (lowerMessage.contains(keyword)) {
                //log this for monitoring (with user consent! <- super important)
                logRiskDetection(keyword);
                return true;
            }
        }

        //check for multiple distress Keywords (indicates high distress)
        long distressCount = DISTRESS_KEYWORDS.stream()
                                              .filter(lowerMessage::contains)
                                              .count();

        //TODO change if to low or high
        // if msg contains 2 or more distress keywords flag as risky
        if (distressCount >= 2) {
            logRiskDetection("Multiple distress indicators");
            return true;
        }

        return false;
    }

    /**
     * Analyze overall sentiment of a message
     * Returns: "positive","neutral" or "negative"
     * @param message the message text
     * @return Sentiment classification
     */
    public String analyzeSentiment(String message) {
        String lowerMessage = message.toLowerCase();

        //simple keyword based sentiment analysis
        //TODO in prod check against NLP library or API

        List<String> positiveWords = Arrays.asList("good", "great", "happy",
          "better", "hopeful", "grateful", "thankful", "peaceful", "calm");

        List<String> negativeWords = Arrays.asList("bad", "terrible", "sad", "worse",
          "anxious", "depressed", "scared", "worried", "upset");

        long positiveCount = positiveWords.stream()
                                          .filter(lowerMessage::contains)
                                          .count();

        long negativeCount = negativeWords.stream()
                                          .filter(lowerMessage::contains)
                                          .count();

        if (positiveCount > negativeCount) {
            return "positive";
        } else if (negativeCount > positiveCount) {
            return "negative";
        } else {
            return "neutral";
        }
    }

    /**
     * Log risk detection for monitoring and safety
     * TODO in prod this could alert appropriate personnel
     * @param indicator what triggerd the risk detection
     */

    private void logRiskDetection(String indicator) {
        //TODO for prod. this should:
        // log to a secure monitoring system
        // Alert appropriate personnel if severity is high
        // store with timestamp and user ID (anonymized)

        System.out.println(
          "Risk DETECTED: " + indicator + " at " + java.time.LocalDateTime.now());

        //TODO implement proper logging and alerting system...
    }

    /**
     * Get appropriate crisis resources based on message content
     * @return String with crisis hotline information
     */
    public String getCrisisResources() {
        //TODO keep up to date on numbers/websites
        return "\n\n⚠️ If you're in crisis or thinking about harming yourself, " +
          "please reach out for immediate help:\n" +
          "• 112 - Emergency Services (EU & Sweden): Dial 112 for immediate help\n" +
          "• Suicide Zero (Sweden): 90 101 101 or visit https://suicidezero.se\n" +
          "• The Samaritans (UK & Ireland): Call 116 123 or visit https://www" +
          ".samaritans.org\n" +
          "• International Association for Suicide Prevention: https://www.iasp" +
          ".info/resources/Crisis_Centres/\n\n" +
          "You don't have to face this alone. Professional help is available 24/7.";
    }


}
