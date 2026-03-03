'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { cartApi, CartResponse } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

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
      setCart(data);
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(itemId);
    try {
      await cartApi.updateCartItem(itemId, quantity);
      await loadCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      await cartApi.removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      console.error('Error removing item:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    try {
      await cartApi.clearCart();
      await loadCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left flex items-end justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">Your Cart</h1>
          <p className="text-muted-foreground">
            {cart?.items.length ? `You have ${cart.totalItems} items in your cart` : 'Your cart is empty'}
          </p>
        </div>
      </motion.div>

      {!cart || cart.items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/50 rounded-3xl shadow-sm p-16 text-center max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Your bag is empty.</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Looks like you haven't added anything to your cart yet. Discover our latest products and find something you love.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-1 transition-all"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.items.map((item) => {
                const imageUrl = item.productImageUrl
                  ? (item.productImageUrl.startsWith('http') ? item.productImageUrl : `${API_URL}${item.productImageUrl}`)
                  : '/placeholder-product.svg';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-card border border-border/50 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden transition-all hover:border-primary/30"
                  >
                    {updating === item.id && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}

                    <div className="w-32 h-32 shrink-0 bg-secondary/50 rounded-xl flex items-center justify-center p-3 relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }}
                      />
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left flex flex-col gap-2">
                      <Link href={`/products/${item.productId}`} className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                        {item.productName}
                      </Link>
                      <p className="text-primary font-extrabold text-lg">${item.productPrice.toFixed(2)}</p>

                      <div className="flex items-center justify-center sm:justify-between mt-4 w-full">
                        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border/50">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="w-10 h-10 rounded-md bg-transparent hover:bg-background flex items-center justify-center disabled:opacity-50 text-foreground transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="w-10 h-10 rounded-md bg-transparent hover:bg-background flex items-center justify-center disabled:opacity-50 text-foreground transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="hidden sm:block text-right">
                          <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                          <p className="font-bold text-foreground text-lg">${item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors hidden sm:block"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {/* Mobile delete button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      className="sm:hidden w-full py-3 mt-4 text-destructive border border-destructive/20 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Item
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive/80 text-sm font-semibold flex items-center gap-2 px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear All Items
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border/50 rounded-3xl shadow-lg p-8 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b border-border/50">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span className="text-foreground">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping Estimation</span>
                  <span className="text-green-500 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Tax Estimation</span>
                  <span className="text-foreground">$0.00</span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6 mb-8 mt-2">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-1 transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-6 pt-6 border-t border-border/50 flex flex-col gap-4 text-center">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Secure checkout
                </p>
                <Link href="/" className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
