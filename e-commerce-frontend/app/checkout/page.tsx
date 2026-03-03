'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { cartApi, orderApi, CartResponse } from '@/lib/api';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, CreditCard, Loader2, CheckCircle2, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    loadCart();
  }, [isLoggedIn]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      if (data.items.length === 0) {
        router.push('/cart');
        return;
      }
      setCart(data);
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const order = await orderApi.checkout();
      router.push(`/orders/${order.id}/success`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  if (loading || !cart) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Preparing your checkout...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Return to Cart
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">Secure Checkout</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-500" /> All transactions are secure and encrypted.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl mb-8 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
            <span className="font-bold text-lg">!</span>
          </div>
          <p className="font-medium">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-8">

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-3xl shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-bold text-foreground">Customer Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Full Name</label>
                <div className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-medium">
                  {user?.fullName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Email Address</label>
                <div className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-medium">
                  {user?.email}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Method (Mock UI) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-3xl shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</div>
              <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>
            </div>

            <div className="border border-primary bg-primary/5 rounded-2xl p-4 flex items-start gap-4 cursor-pointer">
              <div className="mt-1 w-5 h-5 rounded-full border-[5px] border-primary bg-background shrink-0"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-foreground" />
                  <span className="font-bold text-foreground">Credit Card</span>
                </div>
                <p className="text-sm text-muted-foreground">Pay securely with your Visa, Mastercard, or Amex.</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-3xl shadow-lg p-8 sticky top-24"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center p-1 shrink-0">
                        <img
                          src={item.productImageUrl || '/placeholder-product.svg'}
                          alt={item.productName}
                          className="max-w-full max-h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="font-medium text-foreground truncate text-sm">{item.productName}</span>
                  </div>
                  <span className="font-bold text-foreground whitespace-nowrap">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/50 pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground font-medium text-sm">
                <span>Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-medium text-sm">
                <span>Shipping</span>
                <span className="text-green-500 font-bold text-sm">Free</span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-medium text-foreground">Total</span>
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all ${placing
                  ? 'bg-primary/70 text-primary-foreground/80 cursor-not-allowed shadow-none'
                  : 'bg-primary text-primary-foreground hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-1'
                }`}
            >
              {placing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" /> Complete Purchase
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Encrypted and Secure
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
