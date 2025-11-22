package org.chatbot.controller;

import org.chatbot.AiService.GPT4ALLApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:3000")
public class HealthController {

    @Autowired
    private GPT4ALLApiService gpT4ALLApiService;

    @GetMapping
    public ResponseEntity<?> healthCheck() {
        boolean isAvailable = gpT4ALLApiService.isApiAvailable();
        String configInfo = gpT4ALLApiService.getConfigInfo();
        List<String> models = gpT4ALLApiService.getAvailableModels();

        return ResponseEntity.ok(
          Map.of("status", isAvailable ? "healthy" : "unavailable",
                 "aiService", "GPT4ALL Local API", "config", configInfo,
                 "availableModels", models, "ready", isAvailable));
    }
}
