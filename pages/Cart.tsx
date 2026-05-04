
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Info } from 'lucide-react';
import { useCurrency } from '../context/currency';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
        <div className="bg-gray-50 p-10 rounded-full mb-8">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">Your bag is empty.</h2>
        <p className="text-gray-500 mb-10 text-center max-w-sm">Every queen needs her crown. Browse our latest collections to find yours.</p>
        <Link to="/shop" className="bg-black text-white px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-brand transition-all">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">Your Shopping Bag</h1>
        <Link to="/shop" className="text-[10px] font-black uppercase tracking-[0.3em] text-brand hover:text-black transition-colors flex items-center gap-2">
          <ArrowLeft className="w-3 h-3" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* List */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100 group">
              <div className="w-24 md:w-32 aspect-[3/4] bg-white rounded-3xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-50">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg md:text-xl italic">{item.name}</h3>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-4">{item.category}</p>
                <div className="mt-auto flex justify-between items-center">
                  <div className="flex items-center bg-gray-50 rounded-full px-2">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-3 text-gray-400 hover:text-black"><Minus className="w-3 h-3" /></button>
                    <span className="px-4 font-black text-sm">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-3 text-gray-400 hover:text-black"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="font-black text-lg">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-50 h-fit sticky top-32">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-gray-50 pb-6">Bag Summary</h2>
          <div className="space-y-6 mb-10">
            <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>

            <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10 space-y-3">
              <div className="flex items-center gap-2 text-brand text-[9px] font-black uppercase tracking-widest">
                <Info className="w-3 h-3" /> DELIVERY NOTE
              </div>
              <p className="text-[10px] text-gray-500 font-medium italic leading-relaxed">
                Bespoke shipping rates will be calculated at checkout based on your destination (Nigeria or International).
              </p>
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-between items-center font-black text-2xl italic">
              <span>Estimated Total</span>
              <span className="text-brand">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-press w-full bg-black text-white py-8 rounded-full font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-brand transition-all shadow-2xl shadow-black/10"
          >
            PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-10 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Secure Global Transactions</p>
            <div className="flex justify-center gap-6 grayscale opacity-30">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
