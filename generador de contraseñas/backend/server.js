const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Password Schema
const passwordSchema = new mongoose.Schema({
  password: { type: String, required: true },
  length: { type: Number, required: true },
  includeSpecialChars: { type: Boolean, required: true },
  includeNumbers: { type: Boolean, required: true },
  includeUppercase: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Password = mongoose.model('Password', passwordSchema);

// Generate Password Function
function generatePassword(length, includeSpecialChars, includeNumbers, includeUppercase) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let chars = lowercase;
  if (includeUppercase) chars += uppercase;
  if (includeNumbers) chars += numbers;
  if (includeSpecialChars) chars += specialChars;
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
}

// Password Generation Endpoint
app.get('/generar-password', async (req, res) => {
  try {
    // Parse query parameters
    const length = parseInt(req.query.length) || 12;
    const includeSpecialChars = req.query.special === 'true';
    const includeNumbers = req.query.numbers === 'true';
    const includeUppercase = req.query.uppercase === 'true';
    
    // Generate password
    const password = generatePassword(
      length,
      includeSpecialChars,
      includeNumbers,
      includeUppercase
    );
    
    // Save to database
    const newPassword = new Password({
      password,
      length,
      includeSpecialChars,
      includeNumbers,
      includeUppercase
    });
    
    await newPassword.save();
    
    // Send response
    res.json({ 
      password,
      saved: true
    });
  } catch (error) {
    console.error('Error generating password:', error);
    res.status(500).json({ error: 'Error generating password' });
  }
});

// Get all saved passwords
app.get('/passwords', async (req, res) => {
  try {
    const passwords = await Password.find().sort({ createdAt: -1 });
    res.json(passwords);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({ error: 'Error fetching passwords' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 