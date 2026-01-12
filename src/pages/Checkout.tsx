import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { ShippingAddress } from '@/types';

export default function Checkout() {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const shippingCost = state.total >= 100 ? 0 : 9.99;
  const orderTotal = state.total + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, this would send the order to your API
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     items: state.items,
    //     total: orderTotal,
    //     shippingAddress: formData,
    //   }),
    // });

    setOrderComplete(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (state.items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <Layout>
        <div className="container-shop py-16 lg:py-24">
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Order Confirmed!
            </h1>
            <p className="mt-4 text-muted-foreground">
              Thank you for your order. We've sent a confirmation email with your order details.
            </p>
            <Link to="/shop">
              <Button className="mt-8" size="lg">
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
        <Link
          to="/cart"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>

        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                Shipping Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info - Simplified for demo */}
            <div className="pt-6 border-t border-border">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                Payment Method
              </h2>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  This is a demo store. No actual payment will be processed.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order • ${formatCurrency(orderTotal)}`}
            </Button>
          </form>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-lg shadow-soft p-6 sticky top-24">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatCurrency(
                        (item.product.salePrice || item.product.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-6 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
