'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, Product } from '@/lib/api';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white font-black text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center animate-fadeInUp">
            <div className="inline-block mb-6 p-6 bg-red-500/20 rounded-full border-2 border-red-400">
              <span className="text-5xl">⚠️</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-4">Product Not Found</h1>
            <p className="text-red-200 text-lg mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-black text-lg shadow-lg hover:shadow-2xl hover:scale-105"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057';
  const imageUrl = product.imageUrl 
    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL}${product.imageUrl}`)
    : '/placeholder-product.svg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Breadcrumb Navigation */}
      <div className="relative z-10 pt-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors duration-300 font-semibold text-sm mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Back to Store
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              ✨ Product Details
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-xl text-blue-100 font-semibold">
              Discover all the details and features of this amazing product.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 mb-12 animate-fadeInUp">
            {/* Product Image Section */}
            <div className="group">
              <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-2xl p-8 border-2 border-white/30 backdrop-blur-sm overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10 flex items-center justify-center min-h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-80 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                </div>

                {/* Product Badge */}
                <div className="relative z-10 mt-6 flex items-center justify-between">
                  <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-black">
                    🔆 In Stock
                  </div>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col justify-between">
              {/* Price and Description */}
              <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-2xl p-8 border-2 border-white/30 backdrop-blur-sm animate-fadeInUp mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  {/* Price Section */}
                  <div className="mb-8">
                    <p className="text-gray-600 font-bold text-sm mb-2">PRICE</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${(product.price * 1.2).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-600 font-bold">💰 Save 16% today!</div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-blue-300 to-cyan-300 mb-8"></div>

                  {/* Description */}
                  <div>
                    <p className="text-gray-900 font-bold text-sm mb-3">DESCRIPTION</p>
                    <p className="text-gray-700 leading-relaxed font-semibold">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                  <p className="text-white/60 text-xs font-bold mb-1">PRODUCT ID</p>
                  <p className="text-white font-black text-lg">#{product.id}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  <p className="text-white/60 text-xs font-bold mb-1">AVAILABILITY</p>
                  <p className="text-green-400 font-black text-lg">In Stock</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                  <p className="text-white/60 text-xs font-bold mb-1">RATING</p>
                  <p className="text-yellow-400 font-black text-lg">★ 5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-2xl p-8 border-2 border-white/30 backdrop-blur-sm mb-12 animate-fadeInUp">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <p className="text-gray-900 font-black text-lg mb-6">Manage this product</p>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push(`/products/edit/${product.id}`)}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-5 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-black text-lg shadow-lg hover:shadow-2xl hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    ✏️ Edit Product
                  </span>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="group relative overflow-hidden bg-gradient-to-r from-slate-600 to-slate-700 text-white px-8 py-5 rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-black text-lg shadow-lg hover:shadow-2xl hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    🏪 View All Products
                  </span>
                </button>
              </div>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="group w-full mt-4 relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-5 rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-black text-lg shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {deleting ? '⏳ Deleting...' : '🗑️ Delete Product'}
                </span>
              </button>
            </div>
          </div>

          {/* Related Navigation */}
          <div className="grid md:grid-cols-3 gap-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <button
              onClick={() => router.push('/')}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-white font-black mb-2">Back to Home</h3>
              <p className="text-white/60 text-sm">Return to the main store</p>
            </button>
            <button
              onClick={() => router.push('/products/create')}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-4xl mb-3">➕</div>
              <h3 className="text-white font-black mb-2">Create Product</h3>
              <p className="text-white/60 text-sm">Add a new product</p>
            </button>
            <button
              onClick={() => router.push(`/products/edit/${product.id}`)}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-4xl mb-3">✏️</div>
              <h3 className="text-white font-black mb-2">Manage Product</h3>
              <p className="text-white/60 text-sm">Edit product details</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
