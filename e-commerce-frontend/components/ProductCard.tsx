'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, cartApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057';

  const imageUrl = product.imageUrl
    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL}${product.imageUrl}`)
    : '/placeholder-product.svg';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setAdding(true);
    try {
      await cartApi.addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="relative bg-card rounded-2xl border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col group-hover:-translate-y-1">

          <div className="relative h-64 bg-secondary/50 overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={imageUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain relative z-20 drop-shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.svg';
              }}
            />
          </div>

          <div className="p-5 flex-1 flex flex-col relative z-20 bg-card">
            <h3 className="text-lg font-bold text-card-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <p className="text-2xl font-extrabold text-foreground tracking-tight">
                ${product.price.toFixed(2)}
              </p>

              <button
                onClick={handleAddToCart}
                disabled={adding || added}
                className={`relative overflow-hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${added
                  ? 'bg-green-500 text-white'
                  : adding
                    ? 'bg-secondary text-muted-foreground'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-primary/30'
                  } disabled:opacity-80`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : adding ? (
                    <motion.div
                      key="loader"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
