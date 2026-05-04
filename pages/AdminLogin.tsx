import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure we remove any accidental spaces
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Functional Artisan Authentication
    // Valid Credentials provided via environment variables with a hardened fallback for cPanel builds
    const MASTER_ID = (import.meta.env.VITE_MASTER_ID || 'Chixathairbyedna@gmail.com').toLowerCase();
    const ELITE_KEY = import.meta.env.VITE_ELITE_KEY || 'Chixat.1033';

    setTimeout(() => {
      if (cleanEmail === MASTER_ID && cleanPassword === ELITE_KEY) {
        const sessionToken = btoa(JSON.stringify({
          role: 'Artisan',
          exp: Date.now() + (4 * 60 * 60 * 1000) // 4hr session for tighter security
        }));
        // Use sessionStorage instead of localStorage for higher security
        sessionStorage.setItem('artisan_session', sessionToken);
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied. Ensure your Email and Password are correct.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <img src="https://i.ibb.co/gFrtgKdc/Chixat-Hair.png" alt="Chixat Hair" className="h-[120px] mx-auto mb-8 brightness-0 invert animate-float" />
          <h1 className="text-3xl font-black mb-2 italic text-white tracking-tighter">ChixatHair Admin</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full">
            <ShieldCheck className="w-3 h-3 text-brand" />
            <span className="text-brand uppercase tracking-[0.4em] text-[9px] font-black">Secure Shell v2.4</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-10 md:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[3.5rem] border border-white/10 animate-in zoom-in-95 duration-700">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] focus:ring-4 focus:ring-brand/20 focus:border-brand outline-none transition-all font-medium text-white placeholder-white/10"
                placeholder="admin@chixathair.com"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] focus:ring-4 focus:ring-brand/20 focus:border-brand outline-none transition-all font-medium text-white placeholder-white/10"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-brand transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full bg-brand text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all disabled:bg-white/5 shadow-2xl shadow-brand/20"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <><Lock className="w-4 h-4" /> Authenticate Entry</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-brand transition-all flex items-center gap-3 mx-auto"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;