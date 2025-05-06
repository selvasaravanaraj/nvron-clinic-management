# Clinic Token Management System

A web-based clinic token system that streamlines patient flow and enhances communication between doctors, receptionists, and patients.

## Features

- Patient Interface
  - Online token generation
  - Live token status tracking
  - Queue management
- Doctor Interface
  - Token management
  - Patient flow control
- Reception Interface
  - Full token list management
  - VIP token handling
  - Token order modification

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Real-time updates: Socket.IO

## Project Structure

```
clinic-token-system/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/clinic-token
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Tokens
- GET /api/tokens
- POST /api/tokens
- PUT /api/tokens/:id
- DELETE /api/tokens/:id

### Queue
- GET /api/queue/current
- PUT /api/queue/next
- PUT /api/queue/skip/:id

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 