
import React from 'react';
import { useCurrency, CurrencyCode } from '../context/currency';
import { Globe } from 'lucide-react';

const CurrencySwitcher: React.FC = () => {
    const { currency, setCurrency } = useCurrency();

    const currencies: CurrencyCode[] = ['NGN', 'USD', 'EUR', 'GBP'];

    return (
        <div className="flex items-center gap-2">
            <div className="relative group">
                <button className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 transition-all hover:bg-gray-100 btn-press">
                    <Globe className="w-4 h-4 text-brand" />
                    <span>{currency}</span>
                </button>

                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70] overflow-hidden">
                    <div className="p-2">
                        {currencies.map((code) => (
                            <button
                                key={code}
                                onClick={() => setCurrency(code)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors ${currency === code
                                        ? 'bg-black text-white'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencySwitcher;
