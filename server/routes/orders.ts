import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface OrderRow {
  id: number;
  user_id: number | null;
  status: string;
  total: number;
  shipping_address: string | null;
  created_at: string;
}

interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

// Create order
router.post('/', (req, res) => {
  const { items, shippingAddress, total } = req.body;
  
  if (!items || !items.length || !total) {
    return res.status(400).json({ error: 'Items and total are required' });
  }
  
  // Get user ID if authenticated
  let userId: number | null = null;
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artisan-shop-secret-change-in-production') as { userId: number };
      userId = decoded.userId;
    } catch {
      // Ignore - guest checkout
    }
  }
  
  const result = db.prepare(
    'INSERT INTO orders (user_id, total, shipping_address, status) VALUES (?, ?, ?, ?)'
  ).run(userId, total, JSON.stringify(shippingAddress), 'pending');
  
  const orderId = result.lastInsertRowid as number;
  
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
  );
  
  for (const item of items) {
    insertItem.run(orderId, item.productId, item.quantity, item.price);
    
    // Update stock
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.productId);
  }
  
  res.status(201).json({
    id: String(orderId),
    status: 'pending',
    total,
    createdAt: new Date().toISOString(),
  });
});

// Get user's orders
router.get('/my-orders', authMiddleware, (req: AuthRequest, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.userId) as OrderRow[];
  
  const result = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as OrderItemRow[];
    return {
      id: String(order.id),
      status: order.status,
      total: order.total,
      shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null,
      items: items.map(item => ({
        productId: String(item.product_id),
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.created_at,
    };
  });
  
  res.json(result);
});

export default router;
