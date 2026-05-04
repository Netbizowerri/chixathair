
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    rates: Record<string, number>;
    convertPrice: (priceNGN: number) => number;
    formatPrice: (priceNGN: number) => string;
    loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SYMBOLS: Record<CurrencyCode, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£',
};

// Fallback rates in case API fails
const FALLBACK_RATES: Record<string, number> = {
    NGN: 1,
    USD: 0.00065, // Example rates, will be updated by API
    EUR: 0.00061,
    GBP: 0.00051,
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
        const saved = localStorage.getItem('chixat_currency');
        return (saved as CurrencyCode) || 'NGN';
    });
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
                if (!apiKey) {
                    console.warn('ExchangeRate-API key missing. Using fallback rates.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/NGN`);
                const data = await response.json();

                if (data.result === 'success') {
                    setRates(data.conversion_rates);
                } else {
                    console.error('Failed to fetch exchange rates:', data['error-type']);
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    const setCurrency = (code: CurrencyCode) => {
        setCurrencyState(code);
        localStorage.setItem('chixat_currency', code);
    };

    const convertPrice = (priceNGN: number) => {
        const rate = rates[currency] || FALLBACK_RATES[currency] || 1;
        return priceNGN * rate;
    };

    const formatPrice = (priceNGN: number) => {
        const converted = convertPrice(priceNGN);
        const symbol = SYMBOLS[currency];

        // NGN usually doesn't show decimals in this app's context, others might
        const decimals = currency === 'NGN' ? 0 : 2;

        return `${symbol}${converted.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, convertPrice, formatPrice, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
