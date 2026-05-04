
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, CartItem } from '../types';
import { Minus, Plus, Heart, ShieldCheck, Truck, Sparkles, ArrowRight, Info, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useCurrency } from '../context/currency';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { formatPrice } = useCurrency();

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center animate-in fade-in">
        <h2 className="text-3xl font-black italic mb-6 text-gray-300">Piece not found in the vault.</h2>
        <Link to="/shop" className="btn-press bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    navigate('/cart');
  };

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0&autopause=0&player_id=0&app_id=58479`;
    }
    return null;
  };

  const isVimeo = product.video?.includes('vimeo.com');
  const vimeoUrl = isVimeo ? getVimeoEmbedUrl(product.video!) : null;

  return (
    <div className="bg-[#fcfbf7] font-['Poppins'] overflow-x-hidden min-h-screen">
      <SEO
        title={`${product.name} | Luxury Collection`}
        description={`${product.description} Shop our premium ${product.category} at Chixat Hair.`}
        image={product.images[0]}
        type="product"
      />
      {/* Breadcrumb - Elegant & Minimal */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
        <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <Link to="/shop" className="hover:text-brand transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <span className="text-brand">{product.category}</span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* Left: Pure Vertical Image Gallery Stack */}
          <div className="w-full lg:w-[60%] space-y-12 md:space-y-16">

            {/* Primary Visual: Video (Priority) or First Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-3xl md:rounded-[4rem] shadow-2xl border border-gray-100/50">
              {product.video ? (
                isVimeo ? (
                  <iframe
                    src={vimeoUrl!}
                    className="w-full h-full border-none"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={product.name}
                  ></iframe>
                ) : (
                  <video
                    src={product.video}
                    className="w-full h-full object-cover"
                    poster={product.images[0]}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )
              ) : (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {product.isFeatured && (
                <div className="absolute top-8 left-8 z-10">
                  <div className="bg-brand text-white text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 animate-float">
                    <Sparkles className="w-3 h-3" /> Edna Signature
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Stack: All Curated Imagery */}
            <div className="space-y-12 md:space-y-16">
              {product.images.map((img, idx) => (
                <div key={idx} className="aspect-[3/4] overflow-hidden bg-white rounded-3xl md:rounded-[4rem] shadow-xl border border-gray-100/50">
                  <img
                    src={img}
                    alt={`${product.name} detail view ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Sticky Concierge Panel */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-32 space-y-12 pb-20">
            <div className="animate-in slide-in-from-right duration-700">

              <div className="mb-8">
                <h1 className="text-4xl md:text-7xl font-black mb-6 italic leading-[1.1] tracking-tight text-gray-900">
                  {product.name}
                </h1>

                <div className="flex items-center gap-6">
                  <span className="text-3xl md:text-4xl font-black text-brand">
                    {formatPrice(product.price)}
                  </span>
                  <div className="bg-brand/5 border border-brand/10 text-brand text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                    Place Your Order
                  </div>
                </div>
              </div>

              {/* The Narrative Section */}
              <div className="relative mb-16 pl-8">
                <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-brand/20 rounded-full"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 font-black">The Shop Notes</h3>
                <p className="text-gray-700 leading-relaxed text-xl font-light italic pr-4">
                  "{product.description}"
                </p>
              </div>

              {/* Interaction Hub */}
              <div className="bg-white p-10 md:p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100/80 space-y-12">

                {/* Quantity Control */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Volume</span>
                  <div className="flex items-center gap-8 bg-gray-50 px-6 py-3 rounded-full">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="btn-press w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-lg w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="btn-press w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Action Gutter */}
                <div className="space-y-6 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="btn-press w-full bg-black text-white py-8 md:py-10 rounded-full font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-6 hover:bg-brand transition-all shadow-[0_25px_60px_-15px_rgba(174,122,39,0.3)] group"
                  >
                    SECURE THIS PIECE <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <div className="flex gap-4">
                    <button className="btn-press flex-grow flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                      <Heart className="w-4 h-4" /> Add to Vault
                    </button>
                    <button className="btn-press p-6 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Support Indicators */}
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="flex flex-col gap-2">
                    <Truck className="w-5 h-5 text-brand" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Global Shipping Support</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Premium Fiber Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Callout */}
              <div className="mt-12 p-8 bg-brand/5 rounded-3xl border border-brand/10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-4 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Stylist Tip
                </p>
                <p className="text-xs text-brand/80 font-medium leading-relaxed italic">
                  "Maintain this crown with a light mist to preserve the High Quality Fiber Mix bounce."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
