package org.chatbot.service;

import org.chatbot.dto.AuthResponse;
import org.chatbot.dto.LoginRequest;
import org.chatbot.dto.RegisterRequest;
import org.chatbot.model.User;
import org.chatbot.repository.UserRepository;
import org.chatbot.security.CustomUserDetailsService;
import org.chatbot.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for handling authentication
 * Manages user registration and login
 */
@Service
public class AuthService {

      @Autowired
      private UserRepository userRepository;

      @Autowired
      private PasswordEncoder passwordEncoder;

      @Autowired
      private JwtUtil jwtUtil;

      @Autowired
      private AuthenticationManager authenticationManager;

      @Autowired
      private CustomUserDetailsService userDetailsService;

      /**
       * Register a new user
       *
       * @param request Registration details
       * @return Authentication response with JWT token
       */
      public AuthResponse register( RegisterRequest request ) {
            //Validate input
            if ( request.getName() == null || request.getName()
                    .trim()
                    .isEmpty() ) {
                  throw new IllegalArgumentException( "Name is required" );
            }
            if ( request.getEmail() == null || request.getEmail()
                    .trim()
                    .isEmpty() ) {
                  throw new IllegalArgumentException( "Email is required" );
            }
            if ( request.getPassword() == null || request.getPassword()
                    .length() < 6 ) {
                  throw new IllegalArgumentException( "Password must be at least 6 characters" );
            }

            //check if email already exists
            if ( userRepository.existsByEmail( request.getEmail() ) ) {
                  throw new IllegalArgumentException( "Email already registered" );
            }

            //Create a new user
            User user = new User();
            user.setName( request.getName() );
            user.setEmail( request.getEmail()
                    .toLowerCase() ); //store email in lowercase
            user.setPasswordHash(
                    passwordEncoder.encode( request.getPassword() ) ); //hash password with BCrypt
            user.setCreatedAt( LocalDateTime.now() );

            //Save to database
            User savedUser = userRepository.save( user );

            System.out.println(
                    "New user registered: " + savedUser.getEmail() + " (ID: " + savedUser.getId() + ")" );

            //Generate JWT Token
            UserDetails userDetails = userDetailsService.loadUserByUsername( savedUser.getEmail() );
            String token = jwtUtil.generateToken( userDetails, savedUser.getId() );

            //Return authentication response
            return new AuthResponse(
                    token,
                    savedUser.getEmail(),
                    savedUser.getName(),
                    savedUser.getId()
            );
      }

      /**
       * Authenticate user and generate JWT Token
       *
       * @param request Login credentials
       * @return Authentication response with JWT token
       */
      public AuthResponse login( LoginRequest request ) {
            try {
                  //Validate input
                  if ( request.getEmail() == null || request.getEmail()
                          .trim()
                          .isEmpty() ) {
                        throw new IllegalArgumentException( "Email is required" );
                  }
                  if ( request.getPassword() == null || request.getPassword()
                          .trim()
                          .isEmpty() ) {
                        throw new IllegalArgumentException( "Password is required" );
                  }

                  String email = request.getEmail()
                          .toLowerCase();

                  //Authenticate with Spring Security
                  authenticationManager.authenticate(
                          new UsernamePasswordAuthenticationToken( email, request.getPassword() )
                  );

                  //Load user details
                  UserDetails userDetails = userDetailsService.loadUserByUsername( email );
                  User user = userDetailsService.loadUserEntityByEmail( email );

                  //Generate JWT Token
                  String token = jwtUtil.generateToken( userDetails, user.getId() );

                  System.out.println(
                          "User logged in: " + user.getEmail() + " (ID: " + user.getId() + ")" );

                  //Return authentication response
                  return new AuthResponse(
                          token,
                          user.getEmail(),
                          user.getName(),
                          user.getId()
                  );
            } catch ( BadCredentialsException e ) {
                  throw new IllegalArgumentException( "Invalid email or password" );
            }
      }

      /**
       * Get user ID from JWT token
       *
       * @param token JWT token
       * @return User ID
       */
      public Long getUserIdFromToken( String token ) {
            if ( token != null && token.startsWith( "Bearer " ) ) {
                  token = token.substring( 7 );
            }
            return jwtUtil.extractUserId( token );
      }

      /**
       * Validate JWT Token
       *
       * @param token JWT token
       * @return True if the token is valid, false otherwise
       */
      public boolean validateToken( String token ) {
            if ( token != null && token.startsWith( "Bearer " ) ) {
                  token = token.substring( 7 );
            }
            return jwtUtil.validateToken( token );
      }
}
