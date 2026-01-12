import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { mockProducts, categories } from '@/data/products';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Demo mode check
  const isDemoMode = !user;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddProduct = () => {
    setEditingProduct({
      id: String(Date.now()),
      name: '',
      description: '',
      price: 0,
      image: '',
      category: categories[1],
      stock: 0,
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts((prev) => {
      const exists = prev.find((p) => p.id === editingProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === editingProduct.id ? editingProduct : p));
      }
      return [...prev, editingProduct];
    });

    setShowForm(false);
    setEditingProduct(null);
  };

  // Stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 10).length;

  return (
    <Layout>
      <div className="container-shop py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {isDemoMode ? 'Demo Mode - Changes are temporary' : `Welcome, ${user?.name || 'Admin'}`}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-semibold text-foreground">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-semibold text-foreground">{lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <div className="bg-card rounded-lg shadow-soft">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Products
            </h2>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Product Form Modal */}
          {showForm && editingProduct && (
            <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-lg shadow-soft-xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <form onSubmit={handleSaveProduct}>
                  <div className="p-6 border-b border-border">
                    <h3 className="font-heading text-lg font-semibold">
                      {editingProduct.name ? 'Edit Product' : 'Add New Product'}
                    </h3>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        required
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                          }
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Sale Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingProduct.salePrice || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              salePrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="input-field"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, category: e.target.value })
                          }
                          className="input-field"
                        >
                          {categories.slice(1).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={editingProduct.stock}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                          }
                          required
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <input
                        type="url"
                        value={editingProduct.image}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, image: e.target.value })
                        }
                        required
                        className="input-field"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={editingProduct.featured}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, featured: e.target.checked })
                        }
                        className="rounded border-border"
                      />
                      <label htmlFor="featured" className="text-sm font-medium">
                        Featured Product
                      </label>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Product</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          {product.featured && (
                            <span className="text-xs text-primary">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                    <td className="p-4">
                      <div>
                        {product.salePrice ? (
                          <>
                            <span className="font-medium text-primary">
                              {formatCurrency(product.salePrice)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatCurrency(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{product.stock}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full',
                          product.stock > 10
                            ? 'bg-success/10 text-success'
                            : product.stock > 0
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {product.stock > 10
                          ? 'In Stock'
                          : product.stock > 0
                          ? 'Low Stock'
                          : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
