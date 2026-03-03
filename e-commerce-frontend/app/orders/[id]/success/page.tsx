'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { orderApi, OrderResponse } from '@/lib/api';

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { id } = use(params);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    loadOrder();
  }, [isLoggedIn, id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrder(parseInt(id));
      setOrder(data);
      if (data.status === 'Paid') setPaid(true);
    } catch (err) {
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const updated = await orderApi.payOrder(order.id);
      setOrder(updated);
      setPaid(true);
    } catch (err: any) {
      console.error('Payment failed:', err);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500 text-lg">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 text-lg">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        {paid ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">Your order #{order.id} has been paid successfully.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Order Placed!</h1>
            <p className="text-gray-600 mb-6">Your order #{order.id} has been placed successfully.</p>
          </>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-700 text-sm">
                <span>{item.productName} x{item.quantity}</span>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {!paid && order.status === 'Pending' && (
          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 mb-4"
          >
            {paying ? 'Processing Payment...' : 'Simulate Payment'}
          </button>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/orders" className="text-blue-600 hover:underline font-medium">
            View All Orders
          </Link>
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
