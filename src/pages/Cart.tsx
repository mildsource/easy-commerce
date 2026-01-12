import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function Cart() {
  const { state, removeItem, updateQuantity } = useCart();

  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="container-shop py-16 lg:py-24">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              Your cart is empty
            </h1>
            <p className="mt-3 text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop">
              <Button className="mt-6" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-shop py-8 lg:py-12">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => {
              const price = item.product.salePrice || item.product.price;
              
              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-card rounded-lg shadow-soft animate-fade-in"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-heading font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.product.category}
                    </p>
                    <p className="font-medium text-foreground mt-2">
                      {formatCurrency(price)}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center border border-border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-soft p-6 sticky top-24">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {state.total >= 100 ? 'Free' : formatCurrency(9.99)}
                  </span>
                </div>
                {state.total < 100 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatCurrency(100 - state.total)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(
                      state.total >= 100 ? state.total : state.total + 9.99
                    )}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-6">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/shop" className="block mt-4 text-center">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
