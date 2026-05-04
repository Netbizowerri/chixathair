
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useCurrency } from '../context/currency';

interface ShopProps {
  products: Product[];
  categories: string[];
}

const Shop: React.FC<ShopProps> = ({ products, categories }) => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const { formatPrice } = useCurrency();

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Price: Low' | 'Price: High'>('Newest');

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'Price: Low') {
      return [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High') {
      return [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-['Poppins']">
      {/* Header */}
      <div className="pt-16 pb-10 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black italic mb-4 tracking-tight">
          {selectedCategory === 'All' ? 'SHOP NOW' : selectedCategory}
        </h1>
        <p className="text-gray-400 text-xs md:text-sm max-w-md font-light">The ultimate destination for affordable, high-quality fiber mix hair.</p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 md:top-24 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 mb-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-400 border border-gray-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-16">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 rounded-3xl md:rounded-4xl shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-[8px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full">Sold Out</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-black text-gray-900 group-hover:text-brand transition-colors line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-brand font-bold text-sm">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
