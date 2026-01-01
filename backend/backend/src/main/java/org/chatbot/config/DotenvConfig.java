package org.chatbot.config;


import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * This class loads environment variables from .env file
 * it runs before spring boot starts, so all properties are available
 */
public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        try {

            String userDir = System.getProperty(
              "user.dir"); // usually backend/backend
            Path envPath = Paths.get(userDir, ".env");

        // fallback: look relative to the module
            if (!Files.exists(envPath)) {
                envPath = Paths.get(userDir, "../backend/.env");
            }
            if(!Files.exists(envPath)){
                envPath = Paths.get(userDir, "/backend/backend/.env");
            }
            if (!Files.exists(envPath)) {
                throw new RuntimeException(
                  ".env file not found at: " + envPath.toAbsolutePath());
            }

            Dotenv dotenv = Dotenv.configure()
                                  .directory(envPath.getParent()
                                                    .toString())
                                  .filename(envPath.getFileName()
                                                   .toString())
                                  .ignoreIfMissing() // optional
                                  .load();
//            String basePath = System.getProperty("user.dir"); // current working
//            dir
//            Path envPath = Paths.get(basePath, ".env");
//
//            if (!Files.exists(envPath)) {
//                envPath = Paths.get(basePath, "../.env"); // fallback for tests
//            }
//            //Load .env file from backend root directory
//            Dotenv dotenv = Dotenv.configure()
//                                  .directory(envPath.getParent()
//                                                    .toString())
//                                  .filename(envPath.getFileName()
//                                                   .toString())
//                                  .ignoreIfMissing() // won't crash if missing
//                                  .load();

            // convert dotenv entries to spring properties
            Map<String, Object> envMap = new HashMap<>();
            dotenv.entries()
                  .forEach(entry -> {
                      envMap.put(entry.getKey(), entry.getValue());
                      // set as system property for ${} syntax in application
                      // .property
                      System.setProperty(entry.getKey(), entry.getValue());
                  });

            // add to spring environment
            ConfigurableEnvironment environment =
              applicationContext.getEnvironment();
            environment.getPropertySources()
                       .addFirst(new MapPropertySource("dotenvProperties", envMap));

            System.out.println(" .env file loaded successfully!");
        } catch (Exception e) {
            System.err.println("Could not load .env file: " + e.getMessage());
            System.err.println("Using environment variables or defaults instead.");
        }
    }

}
