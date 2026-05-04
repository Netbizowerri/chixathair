
import React from 'react';
import { ShieldCheck, Clock, Package, Truck, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnsPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf7] font-['Poppins'] animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="relative h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-black">
        <img 
          src="https://i.ibb.co/sxV8x7c/CHIXATHAIR-10.jpg" 
          alt="Chixat Policy" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        <div className="relative z-10 text-center text-white px-6">
          <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 px-6 py-2 rounded-full text-brand-light text-[10px] font-black uppercase tracking-[0.4em] mb-6 backdrop-blur-md">
            <ShieldCheck className="w-3 h-3" /> Chixat Assurance
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tight">Returns & Refunds</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-3 h-3" /> Return to Boutique
          </Link>
          <h2 className="text-3xl font-black italic mb-6">The House Commitment</h2>
          <p className="text-gray-500 leading-relaxed text-lg italic">
            "At Chixat, we believe every crown should be perfect. If your selection does not meet your highest expectations, we are here to facilitate a seamless transition."
          </p>
        </div>

        <div className="space-y-12">
          {/* Policy Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                <Package className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">Pristine Returns</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                A 100% refund is guaranteed if the hair is returned in its original state: HD lace intact, unstyled, and packaging untorn.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">48-Hour Window</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                The piece must be returned within 48 hours of receipt to be eligible for a full refund or exchange.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">Verification</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Refunds are initiated only after our quality control team confirms the unit remains in its authentic, pristine condition.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">Return Logistics</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Shipping logistics and costs for returning the piece are the responsibility of the client.
              </p>
            </div>
          </div>

          <div className="bg-brand/5 p-10 rounded-[3rem] border border-brand/10">
            <h3 className="text-lg font-black italic mb-4 flex items-center gap-3">
               Refund Timeline <Sparkles className="w-4 h-4 text-brand" />
            </h3>
            <p className="text-sm text-brand/80 leading-relaxed font-medium">
              Upon approval, the refund process typically takes between <span className="font-bold">3 to 7 business days</span>. The funds will be returned to your original payment method as per your bank's processing times.
            </p>
          </div>

          <div className="pt-10 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Need assistance with a return?</p>
            <Link to="/contact" className="btn-press inline-block bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-brand transition-all">
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
