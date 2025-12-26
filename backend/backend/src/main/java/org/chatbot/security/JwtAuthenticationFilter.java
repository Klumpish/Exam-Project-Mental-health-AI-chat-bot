package org.chatbot.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * Intercepts requests and validates JWT tokens
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

      @Autowired
      private JwtUtil jwtUtil;

      @Autowired
      private CustomUserDetailsService userDetailsService;

      @Override
      protected  void doFilterInternal( HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain ) throws ServletException, IOException {
            try{
                  // Get JWT Token from Authorization header
                  String authorizationHeader = request.getHeader("Authorization");

                  String username = null;
                  String jwt = null;

                  // Check if Authorization header exists and starts with "Bearer "
                  if (authorizationHeader != null && authorizationHeader.startsWith( "Bearer " )) {
                        jwt = authorizationHeader.substring(7); // remove "Bearer " prefix
                        try{
                              username = jwtUtil.extractUsername(jwt);
                        } catch ( Exception e ){
                              System.err.println("Error extracting username from JWT token: " + e.getMessage());
                        }
                  }

                  // if we have a username and no authentication in context yet
                  if (username != null && SecurityContextHolder.getContext().getAuthentication() == null){

                        // Load user details
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        // validate token
                        if ( jwtUtil.validateToken( jwt, userDetails ) ){

                              // Create authentication token
                              UsernamePasswordAuthenticationToken authToken =
                                      new UsernamePasswordAuthenticationToken(
                                              userDetails,
                                              null,
                                              userDetails.getAuthorities()
                                      );
                              authToken.setDetails( new WebAuthenticationDetailsSource().buildDetails( request ) );

                              // set authentication in context
                              SecurityContextHolder.getContext().setAuthentication(authToken);

                              System.out.println("✅  JWT Authentication successful for user: " + username);
                        }
                  }

            }catch (Exception e){
                  System.err.println("❌  Error authenticating user: " + e.getMessage());
            }

            // Continue filter chain
            filterChain.doFilter(request, response);
      }
}
