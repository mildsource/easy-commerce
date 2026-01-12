import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string | null;
  stock: number;
  featured: number;
  created_at: string;
  updated_at: string;
}

// Get all products (public)
router.get('/', (req, res) => {
  const { category, search, featured } = req.query;
  
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];
  
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (featured === 'true') {
    query += ' AND featured = 1';
  }
  
  query += ' ORDER BY created_at DESC';
  
  const products = db.prepare(query).all(...params) as ProductRow[];
  
  res.json(products.map(p => ({
    id: String(p.id),
    name: p.name,
    description: p.description || '',
    price: p.price,
    image: p.image || '',
    category: p.category || '',
    stock: p.stock,
    featured: p.featured === 1,
  })));
});

// Get single product (public)
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as ProductRow | undefined;
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({
    id: String(product.id),
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: product.image || '',
    category: product.category || '',
    stock: product.stock,
    featured: product.featured === 1,
  });
});

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res) => {
  const { name, description, price, image, category, stock, featured } = req.body;
  
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  const result = db.prepare(
    'INSERT INTO products (name, description, price, image, category, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, description || '', price, image || '', category || '', stock || 0, featured ? 1 : 0);
  
  res.status(201).json({
    id: String(result.lastInsertRowid),
    name,
    description: description || '',
    price,
    image: image || '',
    category: category || '',
    stock: stock || 0,
    featured: !!featured,
  });
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res) => {
  const { name, description, price, image, category, stock, featured } = req.body;
  
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ?, featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(name, description || '', price, image || '', category || '', stock || 0, featured ? 1 : 0, req.params.id);
  
  res.json({
    id: req.params.id,
    name,
    description: description || '',
    price,
    image: image || '',
    category: category || '',
    stock: stock || 0,
    featured: !!featured,
  });
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res) => {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  
  res.json({ success: true });
});

// Get categories
router.get('/meta/categories', (_req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ""').all() as { category: string }[];
  res.json(categories.map(c => c.category));
});

export default router;
