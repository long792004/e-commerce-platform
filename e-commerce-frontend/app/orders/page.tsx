'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { orderApi, OrderResponse } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle2, XCircle, ArrowRight, Loader2, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [isLoggedIn]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (orderId: number) => {
    try {
      setProcessingId(orderId);
      await orderApi.payOrder(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error paying order:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Paid':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          classes: 'bg-green-500/10 text-green-600 border-green-500/20'
        };
      case 'Cancelled':
        return {
          icon: <XCircle className="w-4 h-4" />,
          classes: 'bg-destructive/10 text-destructive border-destructive/20'
        };
      case 'Pending':
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          classes: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 lg:mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">Order History</h1>
        <p className="text-muted-foreground text-lg flex items-center gap-2">
          <Package className="w-5 h-5" /> Track, manage, and review your purchases.
        </p>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/50 rounded-3xl shadow-sm p-16 text-center max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            You haven't made any purchases. Explore our collection and find something extraordinary.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-1 transition-all"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="bg-secondary/30 px-6 py-5 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Order Number</p>
                        <p className="font-bold text-foreground">#{order.id.toString().padStart(6, '0')}</p>
                      </div>
                      <div className="hidden md:block w-px h-8 bg-border"></div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Date Placed</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-8 bg-border"></div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={cn("px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border", statusConfig.classes)}>
                        {statusConfig.icon} {order.status}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground line-clamp-1">{item.productName}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold text-foreground whitespace-nowrap">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/50">
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handlePay(order.id)}
                          disabled={processingId === order.id}
                          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:pointer-events-none"
                        >
                          {processingId === order.id ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                          ) : (
                            'Pay Now'
                          )}
                        </button>
                      )}
                      <Link
                        href={`/orders/${order.id}/success`}
                        className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                      >
                        View Details <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
