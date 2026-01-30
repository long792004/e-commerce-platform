'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productApi, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 8;

  // Intercept route changes for page transitions
  useEffect(() => {
    const handleRouteChange = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 2000);
    };

    // Create a wrapper for router.push
    const originalPush = router.push;
    const wrappedPush = (href: string | { pathname: string; query?: Record<string, any> }) => {
      handleRouteChange();
      // Convert object to string path if needed
      const path = typeof href === 'string' ? href : href.pathname;
      return originalPush(path);
    };

    // Override router.push temporarily
    (router as any).push = wrappedPush;

    return () => {
      (router as any).push = originalPush;
    };
  }, [router]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, minPrice, maxPrice]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please make sure the backend is running.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search by name or description
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Loading content */}
        <div className="relative z-10 text-center">
          {/* Main spinner with multiple rings */}
          <div className="relative w-32 h-32 mb-12">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 animate-spin"></div>
            
            {/* Middle rotating ring - slower */}
            <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-cyan-400 border-l-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse shadow-2xl shadow-blue-500/50"></div>
            
            {/* Center dot */}
            <div className="absolute inset-12 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Loading text with animation */}
          <div className="space-y-4">
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Loading Premium Products
            </h2>
            <p className="text-white/60 text-lg font-semibold tracking-wide">
              <span className="inline-block animate-bounce" style={{animationDelay: '0s'}}>.</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
              <span className="inline-block animate-bounce" style={{animationDelay: '0.4s'}}>.</span>
            </p>
            <p className="text-white/40 text-sm font-medium mt-4">Please wait a moment while we fetch amazing items for you</p>
          </div>

          {/* Loading progress bar */}
          <div className="mt-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animation: 'slideRight 2s ease-in-out infinite', width: '60%' }}></div>
          </div>

          {/* Stats loading skeleton */}
          <div className="mt-16 grid grid-cols-4 gap-4 w-96">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded-2xl animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white border-l-4 border-red-500 rounded-xl shadow-2xl p-8 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-red-600">Oops! Error Occurred</h3>
            </div>
            <p className="text-gray-700 font-semibold mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-bold hover:scale-105"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Content */}
            <div className="animate-fadeInUp">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
                ✨ Welcome to Premium Store
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Discover <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Amazing</span> Products
              </h1>
              <p className="text-2xl text-blue-100 mb-8 font-semibold">
                Explore our curated collection of premium items. Every product is handpicked for quality and style.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button onClick={scrollToProducts} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105">
                  👇 Start Shopping
                </button>
                <Link href="/products/create" className="bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-lg border-2 border-white/30 hover:scale-105">
                  ➕ Add Product
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-96 animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-8xl">🛍️</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: '📦', label: 'Premium Products', value: filteredProducts.length },
              { icon: '⭐', label: 'Quality Guaranteed', value: '100%' },
              { icon: '🚚', label: 'Fast Shipping', value: 'Worldwide' },
              { icon: '💳', label: 'Secure Payment', value: 'Safe' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="text-5xl mb-3">{stat.icon}</div>
                <p className="text-white/60 text-sm mb-2">{stat.label}</p>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="products" className="relative z-10 bg-gradient-to-b from-transparent to-slate-900 pt-12 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Search and Filter Section */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl p-12 mb-16 border-2 border-blue-200 animate-fadeInUp relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-10 flex items-center gap-3">
                <span className="text-4xl animate-bounce" style={{animationDelay: '0s'}}>🔍</span> Find Your Perfect Product
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-blue-600 mb-3 uppercase tracking-wider">Search Products</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or description..."
                      className="relative w-full px-6 py-4 border-0 rounded-xl focus:ring-0 text-gray-900 font-bold placeholder-gray-500 bg-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl group-hover:scale-125 transition-transform duration-300">🔍</span>
                  </div>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-black text-blue-600 mb-3 uppercase tracking-wider">Min Price</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="relative w-full px-6 py-4 border-0 rounded-xl focus:ring-0 text-gray-900 font-bold placeholder-gray-500 bg-white shadow-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-green-600">$</span>
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-black text-blue-600 mb-3 uppercase tracking-wider">Max Price</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="999.99"
                      step="0.01"
                      min="0"
                      className="relative w-full px-6 py-4 border-0 rounded-xl focus:ring-0 text-gray-900 font-bold placeholder-gray-500 bg-white shadow-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-pink-600">$</span>
                  </div>
                </div>
              </div>

              {/* Filter Results */}
              {/* Filter Results */}
            {(searchTerm || minPrice || maxPrice) && (
              <div className="mt-8 animate-fadeInUp">
                <div className="bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-emerald-300 shadow-lg">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-black">✓</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Found Results</p>
                        <p className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearFilters}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-black px-7 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl uppercase tracking-wider text-sm"
                    >
                      ✕ Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
      
          {filteredProducts.length === 0 && !loading ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-2xl animate-fadeInUp border-2 border-gray-100">
              <div className="text-9xl mb-6 animate-float">📦</div>
              <p className="text-gray-700 text-2xl mb-8 font-bold">
                {products.length === 0 ? '✨ No products yet - Be the first to add one!' : '🔍 No products match your filters'}
              </p>
              {products.length === 0 && (
                <Link href="/products/create" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105">
                  + Add Your First Product
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mb-10 flex items-center justify-between">
                <h2 className="text-4xl font-black text-white">
                  All Products <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">({filteredProducts.length})</span>
                </h2>
                <div className="hidden md:flex items-center gap-2 text-white/60 font-semibold">
                  <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
                  Trending Now
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {currentProducts.map((product, idx) => (
                  <div key={product.id} className="animate-fadeInUp" style={{animationDelay: `${idx * 0.05}s`}}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-8 py-16 border-t border-white/10">
                  <p className="text-white text-lg font-bold">
                    Page <span className="text-blue-400 text-2xl font-black">{currentPage}</span> of <span className="text-purple-400 text-2xl font-black">{totalPages}</span>
                  </p>
                  
                  <div className="flex justify-center items-center gap-3 flex-wrap">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-all duration-300 hover:scale-105 disabled:scale-100"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex gap-2 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-110 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl'
                              : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:border-blue-400'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-all duration-300 hover:scale-105 disabled:scale-100"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Page Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {/* Top slide down */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-900 via-blue-900 to-transparent animate-slideDown"></div>
          
          {/* Bottom slide up */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900 via-purple-900 to-transparent animate-slideUp"></div>

          {/* Center transition content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin shadow-2xl shadow-blue-500/50"></div>
              
              {/* Middle rotating ring - reverse */}
              <div className="absolute inset-4 rounded-full border-3 border-transparent border-b-purple-400 border-l-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2.5s' }}></div>
              
              {/* Inner gradient circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 backdrop-blur-lg shadow-2xl flex items-center justify-center border border-white/20">
                <div className="text-center">
                  <div className="text-3xl mb-2 animate-pulse">✨</div>
                  <p className="text-white font-black text-xs uppercase tracking-widest">Transitioning...</p>
                </div>
              </div>

              {/* Pulsing dots around the circle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400" style={{animationDelay: '0.33s'}}></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-3 h-3 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400" style={{animationDelay: '0.66s'}}></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400" style={{animationDelay: '0.33s'}}></div>
            </div>
          </div>

          {/* Light rays effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 blur-3xl animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Add CSS for slide animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slideUp {
          animation: slideUp 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}


