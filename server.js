import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read users from file
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Helper function to write users to file
function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

// Register endpoint
app.post('/api/users/register', (req, res) => {
  try {
    const { firstName, lastName, middleName, email, password, dob, gender, phoneNumber, address } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const users = readUsers();

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      middleName,
      email,
      password, // In production, this should be hashed
      dob,
      gender,
      phoneNumber,
      address,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Write to file
    if (writeUsers(users)) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: { ...newUser, password: undefined },
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save user' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/users/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Return user without password
    const userWithoutPassword = { ...user, password: undefined };
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users (for reference/debugging)
app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    const usersWithoutPasswords = users.map(u => ({ ...u, password: undefined }));
    res.json({ success: true, users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile endpoint
app.put('/api/users/update', (req, res) => {
  try {
    const { email, firstName, lastName, middleName, dob, gender, phoneNumber, address } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
      middleName,
      dob,
      gender,
      phoneNumber,
      address,
      updatedAt: new Date().toISOString(),
    };

    // Write to file
    if (writeUsers(users)) {
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      res.json({
        success: true,
        message: 'User profile updated successfully',
        user: updatedUser,
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DeedVault API Server is running' });
});

// Get all service requests (aggregate from files)
app.get('/api/requests', (req, res) => {
  try {
    const files = fs.readdirSync(dataDir);
    const requests = [];

    files.forEach((f) => {
      if (f.startsWith('requests_') && f.endsWith('.json')) {
        try {
          const filePath = path.join(dataDir, f);
          const raw = fs.readFileSync(filePath, 'utf-8');
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) requests.push(...arr);
        } catch (e) {
          console.warn('Failed to read request file', f, e);
        }
      }
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error aggregating requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new request for a service
app.post('/api/requests/:serviceId', (req, res) => {
  try {
    const { serviceId } = req.params;
    const payload = req.body;
    if (!payload || !payload.id) {
      return res.status(400).json({ success: false, message: 'Invalid request payload' });
    }

    const fileName = `requests_${serviceId}.json`;
    const filePath = path.join(dataDir, fileName);

    let existing = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf-8')) || [];
      } catch (e) {
        existing = [];
      }
    }

    existing.push(payload);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    res.status(201).json({ success: true, request: payload });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update an existing request
app.put('/api/requests/:serviceId/:requestId', (req, res) => {
  try {
    const { serviceId, requestId } = req.params;
    const updates = req.body;

    const fileName = `requests_${serviceId}.json`;
    const filePath = path.join(dataDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Request file not found' });
    }

    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf-8')) || [];
    } catch (e) {
      existing = [];
    }

    const idx = existing.findIndex(r => String(r.id) === String(requestId));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Merge updates
    existing[idx] = { ...existing[idx], ...updates };

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    res.json({ success: true, request: existing[idx] });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🏛️  DeedVault API Server running on http://localhost:${PORT}`);
  console.log(`📁 User data stored in: ${USERS_FILE}`);
});
