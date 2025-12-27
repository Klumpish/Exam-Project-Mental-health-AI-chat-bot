package org.chatbot.controller;

import org.chatbot.dto.AuthResponse;
import org.chatbot.dto.LoginRequest;
import org.chatbot.dto.RegisterRequest;
import org.chatbot.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


/**
 * Controller for authentication endpoints
 * Handles user registration and login
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

      @Autowired
      private AuthService authService;

      /**
       * Register a new user
       * POST /api/auth/register
       * Body: { "name": "...", "email": "...", "password": "..." }
       */
      @PostMapping("/register")
      public ResponseEntity<?> register( @RequestBody RegisterRequest request ) {
            try {
                  System.out.println( " Registration request for email: " + request.getEmail() );

                  AuthResponse response = authService.register( request );

                  return ResponseEntity.status( HttpStatus.CREATED )
                          .body( response );
            } catch ( IllegalArgumentException e ) {
                  System.err.println( " Registration filed: " + e.getMessage() );
                  return ResponseEntity.badRequest()
                          .body( Map.of( "error", e.getMessage() ) );

            } catch ( Exception e ) {
                  System.err.println( " Registration error: " + e.getMessage() );
                  e.printStackTrace();
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Registration failed. Please try again." ) );
            }
      }

      /**
       * Login user
       * POST /api/auth/login
       * Body: { "email": "...", "password": "..." }
       */
      @PostMapping("/login")
      public ResponseEntity<?> login( @RequestBody LoginRequest request ) {
            try {
                  System.out.println( " Login request for email: " + request.getEmail() );

                  AuthResponse response = authService.login( request );

                  return ResponseEntity.ok( response );
            } catch ( IllegalArgumentException e ) {
                  System.err.println( "❌  Login failed: " + e.getMessage() );
                  return ResponseEntity.status( HttpStatus.UNAUTHORIZED )
                          .body( Map.of( "error", e.getMessage() ) );
            } catch ( Exception e ) {
                  System.err.println( "❌  Login error: " + e.getMessage() );
                  e.printStackTrace();
                  return ResponseEntity.internalServerError()
                          .body( Map.of( "error", "Login failed. Please try again." ) );
            }
      }

      /**
       * Validate token (optional endpoint for fronted to check if token is valid)
       * GET /api/auth/validate
       * Headers: Authorization: Bearer <token>
       */
      @GetMapping("/validate")
      public ResponseEntity<?> validateToken( @RequestHeader("Authorization") String token ) {
            try {
                  boolean isValid = authService.validateToken( token );

                  if ( isValid ) {
                        Long userId = authService.getUserIdFromToken( token );
                        return ResponseEntity.ok( Map.of(
                                "valid", true,
                                "userId", userId
                        ) );
                  } else {
                        return ResponseEntity.status( HttpStatus.UNAUTHORIZED )
                                .body( Map.of(
                                        "valid", false ) );
                  }
            } catch ( Exception e ) {
                  return ResponseEntity.status( HttpStatus.UNAUTHORIZED )
                          .body( Map.of( "valid", false ) );
            }
      }
}
