package org.chatbot.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the application
 * Temp Disabled for dev and testing
 * enable later with JWT authentication
 */

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //TODO:
        //while testing disable all security for now
        //this allows all request without authentication
        http.csrf()
            .disable()
            .cors()
            .and()
            .authorizeRequests()
            .anyRequest()
            .permitAll();

        return http.build();
    }
}
