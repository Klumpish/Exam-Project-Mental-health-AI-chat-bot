#the image we are using
FROM openjdk:17-jdk-slim

#Set working directory
WORKDIR /app

#Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline

#Copy source code
COPY src ./src

#Build the app
RUN ./mvnw clean package -DskipTests

# Expose port 8080
Expose 8080

# Run the app
CMD ["java","-jar","target/mental-health-chatbot-1.0.0.jar"]
