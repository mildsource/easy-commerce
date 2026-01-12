import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/data/products';
import { formatCurrency, cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const product = mockProducts.find((p) => p.id === Number(id));
  const relatedProducts = mockProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="container-shop py-16 text-center">
          <h1 className="font-heading text-2xl font-semibold">Product not found</h1>
          <Link to="/shop">
            <Button className="mt-4">Back to Shop</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const currentPrice = product.salePrice || product.price;
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  return (
    <Layout>
      <div className="container-shop py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted animate-fade-in">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.salePrice && (
              <span className="badge-sale absolute top-4 left-4 text-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-slide-up">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mt-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold text-primary">
                {formatCurrency(currentPrice)}
              </span>
              {product.salePrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mt-6">
              <span
                className={cn(
                  'inline-flex items-center text-sm font-medium',
                  product.stock > 10
                    ? 'text-success'
                    : product.stock > 0
                    ? 'text-warning'
                    : 'text-destructive'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full mr-2',
                    product.stock > 10
                      ? 'bg-success'
                      : product.stock > 0
                      ? 'bg-warning'
                      : 'bg-destructive'
                  )}
                />
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Product Details
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Free shipping on orders over $100</li>
                <li>• 30-day return policy</li>
                <li>• Handcrafted with care</li>
                <li>• Sustainable materials</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <ProductGrid products={relatedProducts} title="You May Also Like" />
          </section>
        )}
      </div>
    </Layout>
  );
}
