import { Router } from 'express';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
