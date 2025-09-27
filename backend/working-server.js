import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let lands = [];
let userIdCounter = 1;
let landIdCounter = 1;

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, phone, governmentId, department } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = {
      id: userIdCounter++,
      name, email, password, role, phone, governmentId, department,
      token: `token_${userIdCounter-1}_${Date.now()}`,
      isVerified: false
    };

    users.push(user);
    console.log('User registered:', email, 'as', role);

    res.json({
      success: true,
      message: 'User registered successfully',
      token: user.token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, governmentId: user.governmentId, department: user.department, isVerified: user.isVerified }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('User logged in:', email);
    res.json({
      success: true,
      message: 'Login successful',
      token: user.token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, governmentId: user.governmentId, department: user.department, isVerified: user.isVerified }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/lands', (req, res) => {
  res.json({ success: true, lands: lands });
});

app.post('/api/lands', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = users.find(u => u.token === token);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const landData = req.body;
    const land = {
      id: landIdCounter++,
      ...landData,
      owner: user.id,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    lands.push(land);
    console.log('Land created:', land.id, 'by user', user.id);

    res.status(201).json({
      success: true,
      message: 'Land created successfully',
      land: land
    });
  } catch (error) {
    console.error('Create land error:', error);
    res.status(500).json({ success: false, message: 'Failed to create land' });
  }
});

app.get('/api/lands/my/lands', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = users.find(u => u.token === token);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const userLands = lands.filter(land => land.owner === user.id);
    console.log(`Fetching lands for user ${user.id}:`, userLands.length, 'lands found');
    
    res.json({ success: true, lands: userLands });
  } catch (error) {
    console.error('Get user lands error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user lands' });
  }
});

const PORT = 5010;
app.listen(PORT, () => {
  console.log(`��� Server running on port ${PORT}`);
  console.log(`��� http://localhost:${PORT}/health`);
});
