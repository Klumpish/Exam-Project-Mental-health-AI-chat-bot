#the image we are using
FROM eclipse-temurin:21-jdk-jammy

#Set working directory
WORKDIR /app

#Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies
RUN  chmod +x mvnw && ./mvnw dependency:go-offline

#Copy source code
COPY src ./src

#Build the app
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the app
CMD ["java","-jar","target/mental-health-chatbot-0.0.1-SNAPSHOT.jar"]
