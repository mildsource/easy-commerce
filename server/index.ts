import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { initializeDatabase } from './db/index.js';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directory exists for SQLite
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// API routes - MUST come before static files
app.use('/api', apiRoutes);

// Serve static frontend files
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // SPA fallback - MUST be last
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Database: ${process.env.DATABASE_PATH || './data/app.db'}`);
});
