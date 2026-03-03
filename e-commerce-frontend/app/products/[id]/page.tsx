'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, cartApi, Product } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Edit, Trash2, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productApi.getById(Number(id));
      setProduct(data);
    } catch (err) {
      setError('Product not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleting(true);
      await productApi.delete(Number(id));
      router.push('/');
    } catch (err) {
      alert('Failed to delete product');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await cartApi.addToCart(Number(id), 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-destructive/10 border border-destructive/20 text-destructive px-6 py-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p>{error || 'Product not found'}</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Safety
          </Link>
        </div>
      </div>
    );
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057';
  const imageUrl = product.imageUrl
    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL}${product.imageUrl}`)
    : '/placeholder-product.svg';

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 lg:px-8 max-w-7xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <div className="bg-card border border-border/50 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="lg:flex">

          {/* Image Section */}
          <div className="lg:w-1/2 relative bg-secondary/30 p-8 lg:p-16 flex items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full h-full flex justify-center items-center"
            >
              <img
                src={imageUrl}
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain drop-shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.svg';
                }}
              />
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-card">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  New Arrival
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  ${product.price.toFixed(2)}
                </p>
                <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-sm font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> In Stock
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert mb-10 text-muted-foreground">
                <p className="leading-relaxed">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || added}
                  className={`relative w-full overflow-hidden rounded-2xl py-5 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${added
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1'
                    } disabled:opacity-80`}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.div key="check" className="flex items-center gap-2">
                        <Check className="w-6 h-6" />
                        <span>Added to Cart!</span>
                      </motion.div>
                    ) : addingToCart ? (
                      <motion.div key="loader" className="flex items-center gap-2">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="cart" className="flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        <span>Add to Cart</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">30-Day Returns</span>
                </div>
              </div>

              {/* Admin Actions */}
              {isLoggedIn && (
                <div className="mt-8 pt-8 border-t border-border/50 flex gap-4">
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 flex items-center justify-center gap-2 bg-destructive/10 text-destructive py-3 rounded-xl font-semibold hover:bg-destructive/20 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
