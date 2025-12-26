package org.chatbot.security;

import org.chatbot.model.User;
import org.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Custom UserDetailsService for Spring security
 * Loads user from database for authentication
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

      @Autowired
      private UserRepository userRepository;

      @Override
      public UserDetails loadUserByUsername( String email) throws UsernameNotFoundException{
            User user = userRepository.findByEmail( email )
                    .orElseThrow(() -> new UsernameNotFoundException( "User not found with email: " + email ));

            //return Spring Security User object
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPasswordHash(),
                    new ArrayList<>()
            );
      }

      /**
       * Load user entity by email (for custom operations)
       */
      public User loadUserEntityByEmail(String email) throws UsernameNotFoundException{
            return userRepository.findByEmail( email )
                    .orElseThrow(() -> new UsernameNotFoundException( "User not found with email: " + email ));
      }

}
