import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  is_admin: number;
}

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const validPassword = bcrypt.compareSync(password, user.password_hash);
  
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const token = generateToken(user.id, user.is_admin === 1);
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.is_admin === 1,
    },
  });
});

// Register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const passwordHash = bcrypt.hashSync(password, 10);
  
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
  ).run(email, passwordHash, name || null);
  
  const token = generateToken(result.lastInsertRowid as number, false);
  
  res.status(201).json({
    token,
    user: {
      id: result.lastInsertRowid,
      email,
      name: name || null,
      isAdmin: false,
    },
  });
});

// Get current user
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  const user = db.prepare('SELECT id, email, name, is_admin FROM users WHERE id = ?').get(req.userId) as UserRow | undefined;
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.is_admin === 1,
  });
});

export default router;
