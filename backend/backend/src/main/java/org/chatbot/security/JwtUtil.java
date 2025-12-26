package org.chatbot.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for JWT token operations
 * Handles token generation, validation, and decoding
 */
@Component
public class JwtUtil {

      @Value("${jwt.secret}")
      private String secret;

      @Value("${jwt.expiration}")
      private Long expiration;

      /**
       * Get signing key from secret
       */
      private Key getSigningKey(){
            byte[] keyBytes = secret.getBytes();
            return Keys.hmacShaKeyFor( keyBytes);
      }

      /**
       * Extract username (email) from token
       */
      public String extractUsername(String token){
            return extractClaim(token, Claims::getSubject);
      }

      /**
       * Extract user ID from token
       */
      public Long extractUserId(String token){
            Claims claims = extractAllClaims(token);
            return claims.get("userId", Long.class);
      }

      /**
       * Extract expiration date from token
       */
      public Date extractExpiration(String token){
            return extractClaim(token,Claims::getExpiration);
      }

      /**
       * Extract specific claim from token
       */
      public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
      }

      /**
       * Extract all claims from a token
       */
      private Claims extractAllClaims(String token){
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
      }

      /**
       * Check if token is expired
       */
      private Boolean isTokenExpired(String token){
            return extractExpiration(token).before(new Date());
      }

      /**
       * Generate token for user
       */
      public String generateToken( UserDetails userDetails, Long userId){
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", userId);
            return createToken(claims, userDetails.getUsername());
      }

      /**
       * Create JWT Token with claims
       */
      private String createToken(Map<String,Object> claims, String subject){
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + expiration);

            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(subject)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
      }

      /**
       * Validate token
       */
      public Boolean validateToken(String token, UserDetails userDetails){
            try {
                  final String username = extractUsername(token);
                  return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
            } catch ( JwtException | IllegalArgumentException e ){
                  System.err.println("JWT token Validation error: " + e.getMessage());
                  return false;
            }
      }

      /**
       * Validate token without UserDetails (for initial validation)
       */
      public Boolean validateToken(String token){
            try{
                  Jwts.parserBuilder()
                          .setSigningKey( getSigningKey() )
                          .build()
                          .parseClaimsJws( token );
                  return !isTokenExpired( token );
            }catch ( JwtException | IllegalArgumentException e ){
                  System.err.println("JWT token Validation error: " + e.getMessage());
                  return false;
            }
      }

}
