import Link from 'next/link';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057';
  
  const imageUrl = product.imageUrl 
    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL}${product.imageUrl}`)
    : '/placeholder-product.svg';

  return (
    <div className="h-full">
      <div className="group relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border-2 border-white/50 hover:border-blue-300 hover:-translate-y-4">
        {/* Premium badge */}
        <div className="absolute top-4 right-4 z-30 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg group-hover:scale-110 transition-transform duration-300">
          ⭐ Featured
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
        
        {/* Image Container */}
        <div className="relative h-72 bg-gradient-to-br from-slate-100 via-blue-100 to-slate-100 flex items-center justify-center p-6 overflow-hidden">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
          
          <img
            src={imageUrl}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.svg';
            }}
          />
        </div>
        
        {/* Content Container */}
        <div className="p-6 flex-1 flex flex-col relative z-20">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-black text-green-600 uppercase tracking-wider">In Stock</span>
          </div>
          
          {/* Product Name */}
          <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300 leading-tight">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">★★★★★</div>
            <span className="text-xs text-gray-500 font-bold">(128 reviews)</span>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed font-semibold group-hover:text-gray-700 transition-colors duration-300">
            {product.description}
          </p>
          
          {/* Footer with Price and Actions */}
          <div className="space-y-4 mt-auto pt-6 border-t-2 border-gray-100">
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Price</span>
                <p className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Original</span>
                <p className="text-sm font-bold text-gray-400 line-through">
                  ${(product.price * 1.15).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* View Details Button */}
              <Link href={`/products/${product.id}`}>
                <button className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-black shadow-lg hover:shadow-xl hover:scale-105 text-sm flex items-center justify-center gap-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">👁️</span>
                  <span className="relative hidden sm:inline">View</span>
                </button>
              </Link>

              {/* Edit Button */}
              <Link href={`/products/edit/${product.id}`}>
                <button className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-black shadow-lg hover:shadow-xl hover:scale-105 text-sm flex items-center justify-center gap-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">✏️</span>
                  <span className="relative hidden sm:inline">Edit</span>
                </button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3 text-xs text-center pt-3 border-t border-gray-100">
              <div className="py-2">
                <span className="text-gray-500 font-bold">Product ID</span>
                <p className="text-gray-700 font-black">#{product.id}</p>
              </div>
              <div className="py-2">
                <span className="text-gray-500 font-bold">Availability</span>
                <p className="text-green-600 font-black">Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}
