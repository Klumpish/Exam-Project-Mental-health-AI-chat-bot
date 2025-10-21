package org.chatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BackendApplication {

    /**
     * Main method - starts the application
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println(
          "Mental Health Chatbot Backend is running on http://localhost:8080");
    }

    /**
     * Create RestTemplate bean for making HTTP requests to external APIs
     * This is used by ChatService to call OpenAI API
     * @return RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Configure CORS to allow frontend to make request to backend
     * this allows requests from http://localhost:3000 (frontend) #TODO change on
     * prod
     * @return WebMvcConfigurer for CORS settings
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);

            }
        };
    }

}
