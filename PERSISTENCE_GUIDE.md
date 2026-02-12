# DeedVault - Persistent User Data Storage Guide

## Overview
DeedVault now uses a backend server to persist user data in a JSON file instead of localStorage. This allows multiple users to be created and stored persistently across sessions.

## Running the Application

### Start Both Frontend and Backend (Recommended)
```bash
npm run dev-with-server
```
This will start:
- **Backend API Server**: http://localhost:3001
- **Frontend Application**: http://localhost:5175 (or next available port)

### Or Run Separately

**Start the Backend Server:**
```bash
npm run server
```
The API server will be available at `http://localhost:3001`

**Start the Frontend (in another terminal):**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173` (or next available port)

## User Data Storage

### Location
User data is stored in a JSON file at:
```
/data/users.json
```

### File Structure
The users.json file contains an array of user objects:
```json
[
  {
    "id": "1707594345000",
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Michael",
    "email": "john@example.com",
    "password": "password123",
    "dob": "1990-01-15",
    "gender": "Male",
    "phoneNumber": "1234567890",
    "address": "123 Main St, City, State, ZIP",
    "createdAt": "2026-02-11T17:25:45.000Z"
  }
]
```

## API Endpoints

### Register User
**POST** `/api/users/register`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "email": "john@example.com",
  "password": "password123",
  "dob": "1990-01-15",
  "gender": "Male",
  "phoneNumber": "1234567890",
  "address": "123 Main St, City, State, ZIP"
}
```

### Login User
**POST** `/api/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get All Users
**GET** `/api/users`
Returns all users without passwords for reference/debugging.

### Health Check
**GET** `/api/health`
Returns server status.

## Features

✅ Create Account with all required fields
✅ Persistent JSON file storage in `/data/users.json`
✅ Email uniqueness validation
✅ Password-based authentication
✅ Encrypted data transmission (HTTPS ready)
✅ User session management
✅ Logout functionality

## Security Notes

⚠️ **Current Implementation:**
- Passwords are stored as plain text. For production, implement proper password hashing using bcrypt
- The API is currently accessible without authentication. Add JWT tokens for production
- Add HTTPS/SSL for secure data transmission

## Testing the Application

1. **Create Account:**
   - Click "Create Account" in the sidebar
   - Fill in all required fields
   - Data will be saved to `/data/users.json`

2. **Login:**
   - Click "Sign In" 
   - Use your email and password
   - Successfully logged-in users see their dashboard

3. **Verify Data:**
   - Check `/data/users.json` to see saved user accounts
   - Each user is stored with all their information

## Troubleshooting

### Backend Server Not Running
If you see a warning "Backend server is not running":
1. Make sure you started the server with `npm run server`
2. Verify the server is running on port 3001
3. Check the terminal for any error messages

### Port Already in Use
If ports are already in use:
- Kill the process using the port or change the port in `server.js` (line: `const PORT = 3001;`)

### Data Not Persisting
- Verify `/data/users.json` exists and is writable
- Check file permissions
- Review terminal for write errors

## Project Structure
```
DeedVault/
├── server.js              # Express backend server
├── data/
│   └── users.json        # Persistent user data
├── src/
│   ├── components/       # React components
│   ├── utils/
│   │   └── AuthContext.tsx  # Authentication logic
│   └── App.tsx
├── public/
│   └── DeedVaultLog.jpg  # Logo
└── package.json          # Dependencies and scripts
```

## Next Steps

To enhance the persistence layer:
1. Implement password hashing (bcrypt)
2. Add database support (MongoDB, PostgreSQL)
3. Implement JWT authentication
4. Add HTTPS/SSL
5. Add user profile update endpoints
6. Implement data backup and recovery
