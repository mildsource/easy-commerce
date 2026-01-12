import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');
export const db = new Database(dbPath);

export function initializeDatabase() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      stock INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      status TEXT DEFAULT 'pending',
      total REAL NOT NULL,
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);
  
  // Check if admin user exists, if not create one
  const adminCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@artisan.com');
  
  if (!adminCheck) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (email, password_hash, name, is_admin) VALUES (?, ?, ?, ?)'
    ).run('admin@artisan.com', passwordHash, 'Admin', 1);
    console.log('Default admin user created: admin@artisan.com / admin123');
  }
  
  // Check if products exist, if not seed with defaults
  const productCheck = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  
  if (productCheck.count === 0) {
    const seedProducts = [
      { name: 'Handcrafted Ceramic Vase', description: 'A beautifully handcrafted ceramic vase with a natural glaze finish.', price: 89.00, category: 'Home Decor', stock: 15, featured: 1, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800' },
      { name: 'Artisan Leather Wallet', description: 'Premium full-grain leather wallet, hand-stitched with care.', price: 125.00, category: 'Accessories', stock: 25, featured: 1, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800' },
      { name: 'Hand-Woven Wool Throw', description: 'Soft, luxurious wool throw blanket in natural earth tones.', price: 195.00, category: 'Textiles', stock: 10, featured: 1, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
      { name: 'Wooden Cutting Board', description: 'Solid walnut cutting board with juice groove, food safe finish.', price: 78.00, category: 'Kitchen', stock: 20, featured: 0, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800' },
      { name: 'Handmade Soy Candle', description: 'Natural soy wax candle with essential oils, 60 hour burn time.', price: 32.00, category: 'Home Decor', stock: 50, featured: 0, image: 'https://images.unsplash.com/photo-1602607434683-1a5f486e5a77?w=800' },
      { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handmade ceramic mugs with unique glazed patterns.', price: 64.00, category: 'Kitchen', stock: 30, featured: 1, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800' },
    ];
    
    const insertProduct = db.prepare(
      'INSERT INTO products (name, description, price, category, stock, featured, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    
    for (const product of seedProducts) {
      insertProduct.run(product.name, product.description, product.price, product.category, product.stock, product.featured, product.image);
    }
    console.log('Seeded default products');
  }
  
  console.log('Database initialized');
}
