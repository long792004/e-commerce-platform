'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isProductsActive = pathname.includes('/products');

  const navLinks = [
    { href: '/', label: '🏪 Store', icon: '🏪' },
    { href: '/products/create', label: '➕ Add Product', icon: '➕' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl sticky top-0 z-50 border-b border-blue-500/20 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300">
                Commerce
              </span>
              <span className="text-xs text-blue-300 font-bold tracking-widest">MARKETPLACE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Navigation Links */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm lg:text-base flex items-center gap-2 whitespace-nowrap ${
                    isActive(link.href) || (link.href === '/' && isProductsActive)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label.split(' ')[1]}</span>
                </Link>
              ))}
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
              <Link
                href="/products/create"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-black shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2 text-sm lg:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">➕ New</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-6 space-y-3 animate-fadeInUp">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-5 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/products/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-black shadow-lg text-center"
              >
                ➕ Create New Product
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Info Bar */}
      <div className="hidden md:block bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-t border-blue-500/30 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-2.5">
          <div className="flex items-center gap-6 text-xs lg:text-sm text-blue-200 font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📍</span>
              <span>Professional E-Commerce Platform</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-purple-400">✨</span>
              <span>Manage products with ease</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
