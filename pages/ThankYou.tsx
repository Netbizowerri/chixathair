
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Sparkles, CheckCircle2, CreditCard, Hash } from 'lucide-react';

const ThankYou: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const customerName = location.state?.name || 'Queen';
  const paystackRef = searchParams.get('reference') || searchParams.get('trxref');

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center px-6 py-20 animate-in zoom-in-95 duration-1000">
      <div className="max-w-2xl w-full text-center bg-white p-12 md:p-24 shadow-2xl rounded-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand"></div>

        <div className="inline-flex items-center justify-center w-24 h-24 bg-brand/10 rounded-full mb-12">
          <CheckCircle2 className="w-12 h-12 text-brand" />
        </div>

        <img src="https://i.ibb.co/gFrtgKdc/Chixat-Hair.png" alt="Chixat Hair" className="h-[101px] mx-auto mb-10" />

        <h1 className="text-4xl md:text-5xl font-bold mb-8 italic">Your Crown Awaits.</h1>
        <h2 className="text-xl md:text-2xl mb-8 text-gray-800 font-light">
          Thank you for choosing Chixat Hair, <span className="text-brand font-bold">{customerName}</span>.
        </h2>

        <p className="text-gray-500 leading-relaxed mb-16 text-lg">
          Edna's team is now preparing your bespoke order with the highest precision. Expect a tracking notification shortly. Welcome to the elite world of Chixat.
        </p>

        {paystackRef && (
          <div className="mb-12 p-6 bg-brand/5 border border-brand/10 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-widest text-brand mb-3 flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Reference
            </p>
            <p className="text-lg font-mono font-bold text-gray-800 break-all flex items-center justify-center gap-2">
              <Hash className="w-4 h-4 text-brand" /> {paystackRef}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <Link
            to="/"
            className="w-full block bg-black text-white py-6 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand transition-all flex items-center justify-center gap-4 shadow-xl"
          >
            Back to the Collection
          </Link>
          <div className="flex items-center justify-center gap-3 text-brand text-[10px] font-black uppercase tracking-[0.5em] pt-6">
            <Sparkles className="w-4 h-4" /> #CHIXATQUEENS
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
