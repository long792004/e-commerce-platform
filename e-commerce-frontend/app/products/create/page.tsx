'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { productApi } from '@/lib/api';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await productApi.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image || undefined,
      });
      router.push('/');
    } catch (err) {
      alert('Failed to create product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              ✨ Create Something Amazing
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
              Launch Your <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Next Product</span>
            </h1>
            <p className="text-2xl text-purple-100 font-semibold max-w-2xl">
              Turn your ideas into reality. Add products to your store and start selling today.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-12 border-2 border-white/30 backdrop-blur-sm animate-fadeInUp relative overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              {/* Product Name */}
              <div className="group">
                <label className="block text-gray-900 font-black mb-3 text-lg flex items-center gap-3">
                  <span className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-black shadow-lg">1</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Product Name</span>
                  <span className="text-red-500 text-2xl font-black">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={40}
                    required
                    className="relative w-full px-6 py-4 text-base font-bold border-0 rounded-xl focus:ring-0 text-black placeholder-gray-500 bg-white shadow-lg transition-all duration-300"
                    placeholder="e.g., Premium Wireless Headphones"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-3 font-bold">{formData.name.length}/40 characters</p>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-gray-900 font-black mb-3 text-lg flex items-center gap-3">
                  <span className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-black shadow-lg">2</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Description</span>
                  <span className="text-red-500 text-2xl font-black">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={200}
                    required
                    rows={5}
                    className="relative w-full px-6 py-4 text-base font-bold border-0 rounded-xl focus:ring-0 text-black placeholder-gray-500 bg-white shadow-lg resize-none transition-all duration-300"
                    placeholder="Describe your product with key features and benefits..."
                  />
                </div>
                <p className="text-xs text-gray-600 mt-3 font-bold">{formData.description.length}/200 characters</p>
              </div>

              {/* Price */}
              <div className="group">
                <label className="block text-gray-900 font-black mb-3 text-lg flex items-center gap-3">
                  <span className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-black shadow-lg">3</span>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Price</span>
                  <span className="text-red-500 text-2xl font-black">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-amber-600">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="relative w-full pl-14 pr-6 py-4 text-base font-bold border-0 rounded-xl focus:ring-0 text-black placeholder-gray-500 bg-white shadow-lg transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 font-bold">💰 Enter the selling price for your product</p>
              </div>

              {/* Product Image */}
              <div className="group">
                <label className="block text-gray-900 font-black mb-3 text-lg flex items-center gap-3">
                  <span className="bg-gradient-to-br from-pink-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-black shadow-lg">4</span>
                  <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">Product Image</span>
                  <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <div className="border-3 border-dashed border-purple-300 rounded-2xl p-10 text-center hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 group hover:shadow-2xl">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    {imagePreview ? (
                      <div className="space-y-5 animate-fadeInUp">
                        <div className="max-w-sm mx-auto rounded-2xl shadow-2xl border-4 border-gradient-to-r from-pink-400 to-purple-400 overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto"
                          />
                        </div>
                        <div>
                          <p className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">✓ Image Added!</p>
                          <p className="text-purple-600 font-bold text-base">Click to change image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-block p-5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                          <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-800 font-black text-lg">Click to upload product image</p>
                        <p className="text-sm text-gray-600 font-semibold">PNG, JPG, GIF up to 10MB</p>
                        <p className="text-xs text-purple-600 font-bold">📸 High-quality images help sell better!</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-5 pt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {loading ? (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Masterpiece...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <span className="text-2xl">🚀</span>
                      <span>Create Product</span>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-5 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 font-black text-lg disabled:opacity-50 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ← Back to Shop
                </button>
              </div>
            </form>
          </div>

          {/* Pro Tips */}
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-white font-black text-lg mb-2">Clear Names</h3>
              <p className="text-white/70 font-semibold text-sm">Use descriptive, specific product names that help customers find you.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-white font-black text-lg mb-2">Great Photos</h3>
              <p className="text-white/70 font-semibold text-sm">High-quality images significantly increase conversion rates.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-white font-black text-lg mb-2">Smart Pricing</h3>
              <p className="text-white/70 font-semibold text-sm">Research competitors and price competitively for success.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
