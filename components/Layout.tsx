import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, Home, Compass, MessageSquare, X, ChevronRight, Phone } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import CurrencySwitcher from './CurrencySwitcher';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <form onSubmit={handleSearch} className="p-8 md:p-12">
          <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
            <Search className="w-8 h-8 text-brand" />
            <input
              autoFocus
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-2xl md:text-3xl font-black italic outline-none placeholder:text-gray-200"
            />
            <button type="button" onClick={onClose} className="p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <p className="w-full text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">Popular Searches</p>
            {['Zikora', 'Kamdili', 'Omalicha', '32"', 'Reddish Brown'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => { setQuery(tag); }}
                className="px-6 py-3 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-brand hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const LOGO_URL = 'https://i.ibb.co/gFrtgKdc/Chixat-Hair.png';

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0 font-['Poppins']">
      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="bg-white/80 backdrop-blur-2xl border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-center h-20 md:h-32">

              {/* Left: Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center btn-press">
                  <img src={LOGO_URL} alt="Chixat Hair Logo" className="h-[62px] md:h-[101px] w-auto object-contain" />
                </Link>
              </div>

              {/* Center: Desktop Nav */}
              <nav className="hidden md:flex space-x-10">
                <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-brand ${location.pathname === '/' ? 'text-brand' : 'text-gray-400'}`}>Home</Link>
                <Link to="/shop" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-brand ${location.pathname === '/shop' ? 'text-brand' : 'text-gray-400'}`}>Shop Now</Link>
                <Link to="/about" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-brand ${location.pathname === '/about' ? 'text-brand' : 'text-gray-400'}`}>About Us</Link>
                <Link to="/contact" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-brand ${location.pathname === '/contact' ? 'text-brand' : 'text-gray-400'}`}>Contact</Link>
              </nav>

              {/* Right: Icons */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-brand hidden sm:block btn-press"
                >
                  <Search className="w-4 h-4" />
                </button>

                <div className="flex items-center">
                  <CurrencySwitcher />
                </div>

                <Link to="/cart" className="relative p-3 bg-black text-white rounded-full btn-press shadow-lg shadow-black/10">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand text-white text-[8px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden p-3 bg-gray-50 rounded-full text-gray-900 btn-press"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="hidden md:block w-12 h-12" /> {/* Layout Spacer */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-4/5 max-sm h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 overflow-hidden flex flex-col">
            <div className="p-8 flex justify-between items-center border-b border-gray-50">
              <img src={LOGO_URL} alt="Chixat Hair" className="h-[62px]" />
              <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-gray-50 rounded-full btn-press">
                <X className="w-5 h-5" />
              </button>
            </div>


            <nav className="flex flex-col gap-8 p-10 text-[10px] font-black uppercase tracking-[0.3em]">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">Home <ChevronRight className="w-4 h-4 text-gray-200" /></Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">Shop All <ChevronRight className="w-4 h-4 text-gray-200" /></Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">About Us <ChevronRight className="w-4 h-4 text-gray-200" /></Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">Contact <ChevronRight className="w-4 h-4 text-gray-200" /></Link>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-2xl border border-gray-100 px-6 py-4 flex justify-between items-center rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
        <Link to="/" className={`btn-press flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-brand' : 'text-gray-400'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-widest">Home</span>
        </Link>
        <Link to="/shop" className={`btn-press flex flex-col items-center gap-1 ${location.pathname === '/shop' ? 'text-brand' : 'text-gray-400'}`}>
          <Compass className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-widest">Explore</span>
        </Link>

        {/* Updated WhatsApp Icon (Original Brand Green) */}
        <a href="https://wa.me/2349114546210" target="_blank" rel="noopener noreferrer" className="btn-press -mt-10 relative">
          <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
        </a>

        <button
          onClick={() => setIsSearchOpen(true)}
          className={`btn-press flex flex-col items-center gap-1 ${location.pathname === '/search' ? 'text-brand' : 'text-gray-400'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-widest">Search</span>
        </button>

        {/* Updated Call Icon */}
        <a href="tel:09114546210" className={`btn-press flex flex-col items-center gap-1 text-gray-400`}>
          <Phone className="w-5 h-5" />
          <span className="text-[7px] font-black uppercase tracking-widest">Call</span>
        </a>
      </nav>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white pt-24 pb-32 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <img src={LOGO_URL} alt="Chixat Hair" className="h-[74px] mb-8 brightness-0 invert" />
            <h2 className="text-3xl font-black mb-8 italic">Elevate your radiance.</h2>

            {/* Responsive Email Section */}
            <div className="flex flex-col sm:flex-row bg-white/5 p-1.5 rounded-2xl sm:rounded-full border border-white/10 max-w-md w-full gap-2">
              <input
                type="email"
                placeholder="Queen's Email"
                className="bg-transparent border-none px-6 py-3 flex-grow rounded-full text-xs outline-none w-full"
              />
              <button className="bg-white text-black font-black px-8 py-4 sm:py-3 rounded-full text-[9px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all btn-press w-full sm:w-auto">
                Join
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2">
            <div>
              <h3 className="font-black mb-6 uppercase tracking-[0.3em] text-[11px] text-brand">Explore</h3>
              <ul className="space-y-4 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Boutique</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-6 uppercase tracking-[0.3em] text-[11px] text-brand">Service</h3>
              <ul className="space-y-4 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
          <p>&copy; 2024 Chixat Affordable Luxury Hair by Edna.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">TikTok</a>
          </div>
        </div>
      </footer>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default Layout;
