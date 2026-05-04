
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCurrency } from '../context/currency';
import { Search as SearchIcon, ShoppingBag } from 'lucide-react';
import SEO from '../components/SEO';

interface SearchResultsProps {
    products: Product[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ products }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const { formatPrice } = useCurrency();

    const filteredProducts = useMemo(() => {
        if (!query) return [];
        return products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }, [products, query]);

    return (
        <div className="min-h-screen bg-[#fcfbf7] font-['Poppins']">
            <SEO
                title={`Search Results for "${query}" | Chixat Hair`}
                description={`Search results for ${query} at Chixat Hair.`}
            />

            {/* Header */}
            <div className="pt-16 pb-10 px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                        <SearchIcon className="w-6 h-6 text-brand" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase">
                        Search Results
                    </h1>
                </div>
                <p className="text-gray-400 text-xs md:text-sm font-light">
                    {filteredProducts.length} results found for <span className="text-black font-bold italic">"{query}"</span>
                </p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                        <div className="bg-gray-50 p-10 rounded-full mb-8">
                            <ShoppingBag className="w-16 h-16 text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black italic mb-4 uppercase">No Products Found</h2>
                        <p className="text-gray-400 mb-10 text-xs uppercase tracking-widest font-black">Try searching with different keywords or browse our shop.</p>
                        <Link to="/shop" className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:bg-brand transition-all">
                            Explore Collections
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
