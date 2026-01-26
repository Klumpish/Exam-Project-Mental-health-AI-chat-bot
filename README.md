# 🧠 Mental Health AI Chatbot

A full-stack mental health support application with AI-powered chat, journaling, and mood tracking features. Built with
Next.js, Spring Boot, and GPT4All for local AI processing.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
    - [Option 1: Docker (Recommended)](#option-1-docker-recommended)
    - [Option 2: Manual Setup](#option-2-manual-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Functionality

- 💬 **AI Chat Support** - Local AI-powered conversations using GPT4All
- 📓 **Daily Journaling** - Private journal entries with full CRUD operations
- 😊 **Mood Tracking** - Log daily mood with trends and analytics
- 📊 **Analytics Dashboard** - 30-day mood trends and statistics

### Security & Privacy

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔒 **Password Encryption** - BCrypt hashing for password security
- 👤 **User Isolation** - Complete data separation between users
- 🛡️ **Protected Routes** - Role-based access control

### User Experience

- 🌙 **Dark Mode** - Easy on the eyes, default theme
- 📱 **Responsive Design** - Works on mobile and desktop
- ⚡ **Real-time Updates** - Instant feedback and loading states
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **HTTP Client:** Fetch API
- **State Management:** React Hooks

### Backend

- **Framework:** Spring Boot 3.5.7
- **Language:** Java 21
- **Build Tool:** Maven
- **Security:** Spring Security + JWT
- **Password Hashing:** BCrypt

### Database

- **RDBMS:** PostgreSQL 15
- **ORM:** Spring Data JPA (Hibernate)

### AI Integration

- **AI Service:** GPT4All Local API
- **Model:** Mistral 7B Instruct (or your chosen model)
- **API:** RESTful HTTP API (OpenAI-compatible)

### DevOps

- **Containerization:** Docker & Docker Compose
- **Version Control:** Git

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Next.js       │   HTTP  │   Spring Boot   │   JDBC  │   PostgreSQL    │
│   Frontend      │◄───────►│   Backend       │◄───────►│   Database      │
│   (Port 3000)   │         │   (Port 8080)   │         │   (Port 5432)   │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                     │
                                     │ HTTP
                                     ▼
                            ┌─────────────────┐
                            │                 │
                            │   GPT4All API   │
                            │   (Port 4891)   │
                            │                 │
                            └─────────────────┘
```

**Architecture Type:** Monolithic (with potential for microservices)

---

## 📦 Prerequisites

### Required Software

1. **Docker & Docker Compose** (Recommended)
    - Docker: [Install Docker](https://docs.docker.com/get-docker/)
    - Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

⚠️ **Note**: If Docker is used, only Docker is required locally.

**OR (for manual setup):**

2. **Node.js 18+ (20+ recommended)**
    - [Download Node.js](https://nodejs.org/)
    - Verify: `node --version`

3. **Java 21+**
    - [Download Java JDK](https://www.oracle.com/java/technologies/downloads/)
    - Verify: `java --version`

4. **Maven 3.8+**
    - Usually included with IntelliJ IDEA
    - Or [Download Maven](https://maven.apache.org/download.cgi)
    - Verify: `mvn --version`

5. **PostgreSQL 15+**
    - [Download PostgreSQL](https://www.postgresql.org/download/)
    - Or use Docker (recommended)
    - Verify: `psql --version`

6. **GPT4All Desktop Application**
    - [Download GPT4All](https://gpt4all.io/)
    - Download a model (e.g., Mistral 7B Instruct)
    - Enable API Server in Settings

---

## 🚀 Installation

### Option 1: Docker (Recommended)

**Step 1: Clone the repository**

```bash
git clone https://github.com/Klumpish/Exam-Project-Mental-health-AI-chat-bot.git
cd Exam-Project-Mental-health-AI-chat-bot
```

**Step 2: Start GPT4All API**

1. Open the **GPT4All Desktop** application
2. Go to **Settings** → **Application**
3. Scroll to **Advanced**
4. Enable **"Local API Server"**
5. Set the port to **4891** (default)
6. Go to the **Models** tab:
    - Press the **Add model** button then
    - in the **GPT4ALL** tab, scroll down until you find the model.
        - Download the model **Mistral Instruct** - with 7B parameters
    - Select the downloaded model as the active model
7. Make sure the API server is running before continuing
   - `http://localhost:4891/v1/models` should return a list of models
   
**Step 3: Create `.env` file**

1. Copy `.env.example` to `.env`
2. Generate a `JWT_SECRET` Value.

   The following commands will generate a secure random value:

   - **Linux / macOS** (terminal): 
   ```bash
   openssl rand -base64 64
   ```
   
   - **Windows** (PowerShell): 
   ```powershell   
      $bytes = New-Object byte[] 64
     [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
     [Convert]::ToBase64String($bytes)
     ```
    - **Any OS** (Node.js):  
    ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
     ```

   
3. Update your`JWT_SECRET=` with the generated value

**Step 4: Run the setup Docker-compose**

```bash
# How to run the docker-compose
docker-compose up -d

# To remove all containers and volumes
docker-compose down -v
```

**Step 5: Access the application**

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: localhost:5432

**Done!** 🎉

---

### Option 2: Manual Setup

#### **1. Setup Database**

```bash
# Start PostgreSQL
# Windows: Should start automatically
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Create database

psql -U postgres
CREATE DATABASE mental_health_db;
\q

# Run setup script

psql -U postgres -d mental_health_db -f backend/database/setup.sql
```

#### **2. Setup Backend**

<details>
<summary><strong>Backend setup & environment variables</strong></summary>

```bash
cd backend

# Create .env file

cat > .env << EOF
DB_URL=jdbc:postgresql://localhost:5432/mental_health_db
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
GPT4ALL_API_URL=http://localhost:4891/v1
GPT4ALL_MODEL_NAME=Mistral Instruct
AI_MAX_TOKENS=50
AI_TEMPERATURE=0.7
JWT_SECRET=$(openssl rand -base64 64)
JWT_EXPIRATION=86400000
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000
EOF

# Build and run

./mvnw clean install
./mvnw spring-boot:run

```

</details>

Backend should now be running on **http://localhost:8080**

#### **3. Setup Frontend**
<details>
<summary><strong>Frontend setup & environment variables</strong></summary>

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

# Run development server
npm run dev
```
</details>
Frontend should now be running on **http://localhost:3000**

#### **4. Setup GPT4All API**

1. Open GPT4All Desktop application
2. Settings > Application > Advanced
3. Enable **"Local API Server"** on port **4891**
4. Select your model (Mistral Instruct recommended)

---

## ⚙️ Configuration

### Environment Variables

#### Backend (`.env`)
<details>
<summary>Backend .env setup</summary>

```bash
DB_URL=jdbc:postgresql://localhost:5432/mental_health_db
DB_USERNAME=chatbot_user
DB_PASSWORD=chatbot_password
GPT4ALL_API_URL=http://localhost:4891/v1
GPT4ALL_MODEL_NAME=Mistral Instruct
AI_MAX_TOKENS=50              # Response length
AI_TEMPERATURE=0.7            # Creativity (0.0-1.0)
JWT_SECRET=<your-secret-key>  # Generate with: openssl rand -base64 64
JWT_EXPIRATION=86400000       # 24 hours in milliseconds
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000
```
</details>

#### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### GPT4All Configuration

**Recommended Settings:**

- **Model:** Mistral 7B Instruct (good balance of speed and quality)
- **Max Tokens:** 150 (adjust based on desired response length)
- **Temperature:** 0.7 (0.5 for more consistent, 0.9 for more creative)

---

## 🎮 Running the Application

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Clean up (removes all data)
docker-compose down -v
```

### Manual Start

```bash
# Terminal 1 - Database (if not using Docker)
# PostgreSQL should be running as a service

# Terminal 2 - Backend
cd backend
./mvnw spring-boot:run

# Terminal 3 - Frontend
cd frontend
npm run dev

# Terminal 4 - GPT4All
# Open GPT4All app and enable API server
```

---

## 🧪 Testing

### Register & Login

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. Login with your credentials

### Test Chat

1. Navigate to Chat page
2. Send a message: "I'm feeling anxious today"
3. Wait 2-5 seconds for AI response
4. Refresh page - history should load

### Test Journal

1. Navigate to Journal page
2. Write an entry
3. Save and verify it appears in the list
4. Try editing and deleting entries

### Test Mood Tracker

1. Navigate to Mood page
2. Select a mood (1-5)
3. Add optional notes
4. Save and check trends section

---

## 📁 Project Structure

```
mental-health-chatbot/
├── backend/backend                    # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/org/chatbot/
│   │       │   ├── controller/     # REST controllers
│   │       │   ├── service/        # Business logic
│   │       │   ├── model/          # JPA entities
│   │       │   ├── repository/     # Data access
│   │       │   ├── security/       # JWT & auth
│   │       │   ├── dto/            # Data transfer objects
│   │       │   ├── config/         # Configuration
|   |       |   └── AiService/      # AI service
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── Dockerfile
│   ├── pom.xml                 # Maven dependencies
│   └── .env                    # Environment variables
│
├── frontend/                   # Next.js frontend
|   ├── src/
|   │ ├── app/
|   │ │ ├── chat/ # Chat page
|   │ │ ├── journal/ # Journal page
|   │ │ ├── login/ # Login page
|   │ │ ├── mood/ # Mood tracker page
|   │ │ ├── register/ # Registration page
|   │ │ └── page.tsx # Homepage
|   │ │
|   │ ├── components/ # Reusable React components
|   │ │ ├── Navigation.tsx
|   │ │ ├── CrisisBox.tsx
|   │ │ ├── InfoBox.tsx
|   │ │ ├── ChatBox.tsx
|   │ │ ├── MessageBubble.tsx
|   │ │ ├── MoodTracker.tsx
|   │ │ └── ProtectedRoute.tsx
|   │ │
|   │ └── services/ # API / backend communication
|   │ ├── authService.ts
|   │ ├── chatService.ts
|   │ ├── journalService.ts
|   │ └── moodService.ts
|   │
|   ├── Dockerfile
|   ├── package.json
|   ├── .env.local
|   └── next.config.ts
│
├── docker-compose.yml         # Docker orchestration
├── README.md                  # This file
└── .gitignore
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe",
  "userId": 1
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe",
  "userId": 1
}
```

### Chat Endpoints

#### Send Message

```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I'm feeling anxious today"
}

Response: 200 OK
{
  "text": "I understand that anxiety can be overwhelming...",
  "timestamp": "2025-01-07T10:30:00"
}
```

#### Get Chat History

```http
GET /api/chat/history
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "text": "I'm feeling anxious",
    "sender": "user",
    "timestamp": "2025-01-07T10:30:00",
    "userId": 1
  },
  ...
]
```

### Journal Endpoints

#### Create Entry

```http
POST /api/journal
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Today was a good day..."
}
```

#### Get All Entries

```http
GET /api/journal
Authorization: Bearer <token>
```

### Mood Endpoints

#### Log Mood

```http
POST /api/mood
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": 4,
  "notes": "Feeling positive after morning walk"
}
```

#### Get Mood Trends

```http
GET /api/mood/trends
Authorization: Bearer <token>
```

---

## 🌍 Production Deployment

### Recommended Architecture

**Monolithic Deployment** (Current - Good for MVP)

- Single application server
- Easier to deploy and maintain
- Lower infrastructure costs
- Suitable for up to 1000+ users

**Microservices (Future - For Scale)**

- Separate services for: Auth, Chat, Journal, Mood
- Independent scaling
- Better fault isolation
- Higher infrastructure costs

---

## 🪳 Troubleshooting

### Common Issues

#### "Failed to fetch" error in frontend

- Check backend is running on port 8080
- Verify CORS settings in backend
- Check JWT token is valid
- Inspect browser console for details

#### GPT4All connection refused

- Ensure GPT4All app is running
- Verify API server is enabled (Settings > Enable Local API Server)
- Check port 4891 is not in use
- Restart GPT4All application

#### Database connection error

- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database "mental_health_dev_db" exists or what name you specified in .env
- Check port 5432 is not blocked

#### Backend won't start

- Check Java version: `java --version` (need 17+)
- Verify .env file exists and is correct
- Check port 8080 is available
- View logs for specific error

#### Docker issues

- Ensure Docker is running
- Try: `docker-compose down -v` then rebuild
- Check logs: `docker-compose logs -f`
- Verify ports are not already in use

### Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs` or console output
2. Verify all services are running
3. Check environment variables
4. Consult the troubleshooting section above

---

## 👨‍💻 Author

**Henrik Mattsson**

- Exam Project - Java & JavaScript Course
- Systemutvecklare Fullstack - Lernia

---

## 🙏 Acknowledgments

- GPT4All for local AI capabilities
- Spring Boot & Next.js communities
- Mental health awareness initiatives

---

**⚠️ Important Disclaimer**

This application is NOT a substitute for professional mental health care. If you're experiencing a mental health crisis,
please contact:

- 🚨 Emergency: 911 or your local emergency number

---

**Made with Love for mental health awareness**