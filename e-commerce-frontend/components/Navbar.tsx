'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Package, PlusCircle, LogOut, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Products', href: '/' }
  ];

  if (isLoggedIn) {
    navLinks.push(
      { name: 'Add Product', href: '/products/create' },
      { name: 'Orders', href: '/orders' }
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            E
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Store
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {isLoggedIn && (
            <Link
              href="/cart"
              className={cn(
                "relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === '/cart' ? "text-primary" : "text-muted-foreground"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
            </Link>
          )}

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex flex-col items-center justify-center text-xs font-bold ring-2 ring-background">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" /> Cart
                </Link>
              )}
              <div className="h-px bg-border my-2" />
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User className="w-5 h-5" />
                    <span>{user?.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-lg font-medium text-destructive flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-xl bg-secondary text-secondary-foreground font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
