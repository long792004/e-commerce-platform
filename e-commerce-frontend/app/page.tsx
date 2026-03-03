'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productApi, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowRight, ShoppingBag, Loader2, X } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 flex items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              2026 Collection Available
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Premium</span> Quality Products.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Elevate your lifestyle with our curated selection of high-end items. Designed for those who appreciate the finer things in aesthetics and functionality.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Shop Now
              </button>
              <Link
                href="/products/create"
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-lg hover:bg-secondary/80 border border-border hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Sell Item
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section id="products-section" className="container mx-auto px-4 py-12 relative z-20">

        {/* Search & Filters Bar */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl shadow-sm p-2 flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="relative w-full md:max-w-md flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground rounded-xl"
              />
            </div>

            <div className="w-full md:w-auto flex items-center justify-between gap-4 px-2 md:px-0">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${isFiltersOpen ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(minPrice || maxPrice) && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse ml-1"></span>
                )}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg shadow-black/5">
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Min Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Max Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="1000.00"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                    {(searchTerm || minPrice || maxPrice) && (
                      <button
                        onClick={handleClearFilters}
                        className="h-11 px-6 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors w-full md:w-auto"
                      >
                        <X className="w-4 h-4" /> Clear All
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status / Results */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium animate-pulse">Curating products for you...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl p-6 flex flex-col items-center text-center max-w-lg mx-auto"
          >
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
              <X className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Oops! Something went wrong</h3>
            <p className="text-sm opacity-90">{error}</p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-card border border-border/50 rounded-3xl"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No products found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {products.length === 0
                ? "Our store is currently empty. Be the first to add an amazing product!"
                : "We couldn't find anything matching your current filters. Try adjusting them."}
            </p>
            {products.length === 0 ? (
              <Link href="/products/create" className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 transition-all font-semibold inline-flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Add First Product
              </Link>
            ) : (
              <button onClick={handleClearFilters} className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full hover:bg-secondary/80 transition-all font-semibold">
                Reset Filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {searchTerm || minPrice || maxPrice ? 'Search Results' : 'Trending Now'}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                Showing <span className="text-foreground">{currentProducts.length}</span> of {filteredProducts.length} products
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {currentProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-card border border-border rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                >
                  Prev
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${currentPage === page
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                          : 'bg-card border border-border hover:bg-secondary text-foreground'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-card border border-border rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
