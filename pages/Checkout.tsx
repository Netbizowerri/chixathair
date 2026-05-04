import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem } from '../types';
import { ArrowLeft, Lock, Loader2, Globe, MapPin } from 'lucide-react';
import { useCurrency } from '../context/currency';

const SHIPPING_DATA = {
  NIGERIA: {
    "East": { rate: 3500, states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"] },
    "West": { rate: 5000, states: ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"] },
    "South": { rate: 5000, states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"] },
    "North Central": { rate: 6500, states: ["Benue", "FCT (Abuja)", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau"] },
    "Far North": { rate: 8000, states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"] },
    "Middle Belt": { rate: 8000, states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"] }
  },
  INTERNATIONAL: {
    "UK (Doorstep)": 80000,
    "USA (Doorstep)": 90000,
    "Canada (Doorstep)": 90000,
    "Dubai (Pick up only)": 18000
  }
};

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [destType, setDestType] = useState<'NIGERIA' | 'INTERNATIONAL'>('NIGERIA');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    location: '',
    zip: '',
    phone: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const shippingInfo = useMemo(() => {
    if (!formData.location) return { rate: 0, label: 'Select Location' };

    if (destType === 'NIGERIA') {
      for (const [zone, data] of Object.entries(SHIPPING_DATA.NIGERIA)) {
        if (data.states.includes(formData.location)) {
          return { rate: data.rate, label: `${zone} Shipping` };
        }
      }
    } else {
      const rate = SHIPPING_DATA.INTERNATIONAL[formData.location as keyof typeof SHIPPING_DATA.INTERNATIONAL];
      return { rate: rate || 0, label: formData.location };
    }

    return { rate: 0, label: 'Standard Shipping' };
  }, [formData.location, destType]);

  const total = subtotal + shippingInfo.rate;

  if (cart.length === 0) {
    return (
      <div className="p-20 text-center font-bold min-h-screen flex items-center justify-center flex-col gap-6">
        <p>Your bag is empty. Our collection awaits your choice.</p>
        <Link to="/shop" className="bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest">Explore Collections</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) {
      alert("Please select your delivery destination to calculate shipping.");
      return;
    }
    setLoading(true);

    try {
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        items: cart,
        totalAmount: total,
        shippingInfo: {
          destination: formData.location,
          shippingRate: shippingInfo.rate,
          shippingLabel: shippingInfo.label,
          address: formData.address,
          phone: formData.phone
        }
      };

      // Build Paystack payment page URL with query params
      const paystackPageUrl = 'https://paystack.shop/pay/chixathairpay';
      const params = new URLSearchParams({
        email: formData.email,
        amount: (total * 100).toString(),
        metadata: JSON.stringify(orderData)
      });

      // Redirect to Paystack payment page
      window.location.href = `${paystackPageUrl}?${params.toString()}`;

    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6 animate-in fade-in duration-700 font-['Poppins']">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

        {/* Checkout Form */}
        <div>
          <Link to="/cart" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black mb-12">
            <ArrowLeft className="w-3 h-3" /> Back to bag
          </Link>
          <h1 className="text-4xl md:text-5xl font-black italic mb-4 uppercase tracking-tighter">Checkout</h1>
          <p className="text-gray-400 text-sm font-medium mb-12">Finalize your selection and secure your bespoke crown.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Destination Toggle */}
            <div className="flex bg-gray-50 p-1.5 rounded-3xl border border-gray-100">
              <button
                type="button"
                onClick={() => { setDestType('NIGERIA'); setFormData({ ...formData, location: '' }); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${destType === 'NIGERIA' ? 'bg-white shadow-lg text-black' : 'text-gray-400'}`}
              >
                <MapPin className="w-4 h-4" /> Nigeria
              </button>
              <button
                type="button"
                onClick={() => { setDestType('INTERNATIONAL'); setFormData({ ...formData, location: '' }); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${destType === 'INTERNATIONAL' ? 'bg-white shadow-lg text-black' : 'text-gray-400'}`}
              >
                <Globe className="w-4 h-4" /> International
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name</label>
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-6 py-5 rounded-3xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</label>
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-6 py-5 rounded-3xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border-none px-6 py-5 rounded-3xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                placeholder="queen@example.com"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Atelier Address</label>
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-gray-50 border-none px-6 py-5 rounded-3xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                placeholder="Plot 12, Victoria Island..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {destType === 'NIGERIA' ? 'State / Region' : 'Country'}
                </label>
                <select
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-6 py-5 rounded-3xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium appearance-none"
                >
                  <option value="">Select Location</option>
                  {destType === 'NIGERIA' ? (
                    Object.values(SHIPPING_DATA.NIGERIA).flatMap(z => z.states).sort().map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))
                  ) : (
                    Object.keys(SHIPPING_DATA.INTERNATIONAL).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-6 py-5 rounded-3xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                  placeholder="+234..."
                />
              </div>
            </div>

            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="btn-press w-full bg-black text-white py-8 rounded-full font-black uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 hover:bg-brand transition-all disabled:bg-gray-400 shadow-2xl shadow-black/10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-5 h-5" /> Pay {formatPrice(total)} & Secure Crown</>}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:border-l lg:border-gray-50 lg:pl-16">
          <h2 className="text-xl font-black uppercase tracking-widest mb-12 pb-4 border-b border-gray-100">Piece Summary</h2>
          <div className="space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar pr-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-20 h-28 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-black line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <span className="font-black text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-gray-50 space-y-6">
            <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest items-center">
              <span>Delivery Fee ({shippingInfo.label})</span>
              <span className="text-brand font-bold">{formatPrice(shippingInfo.rate)}</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-black pt-6">
              <span className="italic">Grand Total</span>
              <span className="text-brand">{formatPrice(total)}</span>
            </div>

            <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-brand mb-2">DELIVERY NOTE</p>
              <p className="text-[10px] text-gray-500 font-medium italic">
                {destType === 'NIGERIA'
                  ? "Orders within Nigeria are delivered via our priority secure logistics partners."
                  : "International orders are delivered via DHL Express doorstep service."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
