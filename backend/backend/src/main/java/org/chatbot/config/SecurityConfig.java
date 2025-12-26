package org.chatbot.config;


import org.chatbot.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security configuration for JWT Authenticationthe application
 */

@Configuration
@EnableWebSecurity
public class SecurityConfig {

      @Autowired
      private JwtAuthenticationFilter jwtAuthenticationFilter;

      /**
       * Password encoder for hashing passwords
       * uses BCrypt
       */
      @Bean
      public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
      }

      /**
       * Authentication manager bean
       */
      @Bean
      public AuthenticationManager authenticationManager( AuthenticationConfiguration authConfig ) throws Exception {
            return authConfig.getAuthenticationManager();
      }

      /**
       * Security filter chain configuration
       */
      @Bean
      public SecurityFilterChain filterChain( HttpSecurity http ) throws Exception {
            http
                    //Disable CSRF (not needed for stateless JWT
                    .csrf( csrf -> csrf.disable() )
                    // Enable CORS
                    .cors( cors -> { } )
                    //Configure authorization
                    .authorizeHttpRequests( auth -> auth
                            //public endpoints (no authentication required)
                            .requestMatchers( "/api/auth/**" )
                            .permitAll()

                            .requestMatchers( "/api/health" )
                            .permitAll()

                            //All other endpoints require authentication
                            .anyRequest()
                            .authenticated()
                    )

                    //Stateless session (JWT-based, no server-side sessions)
                    .sessionManagement( session ->
                            session.sessionCreationPolicy( SessionCreationPolicy.STATELESS )
                    )
                    // add JWT filter before UsernamePasswordAuthenticationFIlter
                    .addFilterBefore( jwtAuthenticationFilter,
                            UsernamePasswordAuthenticationFilter.class );

            return http.build();
      }

      /**
       * CORS configuration
       */
      @Bean
      public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins( Arrays.asList( "http://localhost:3000" ) );
            configuration.setAllowedMethods(
                    Arrays.asList( "GET", "POST", "PUT", "DELETE", "OPTIONS" ) );
            configuration.setAllowedHeaders( Arrays.asList( "*" ) );
            configuration.setAllowCredentials( true );

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration( "/api/**", configuration );

            return source;
      }
}
