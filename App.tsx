import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import AboutUs from './pages/AboutUs';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import ReturnsPolicy from './pages/ReturnsPolicy';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import { Product, CartItem } from './types';
import { getProducts, seedDatabase, getCategories } from './services/firebase';
import { INITIAL_PRODUCTS } from './data';
import { CurrencyProvider } from './context/currency';

const ProtectedAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use sessionStorage for higher security (clears on tab close)
  const session = sessionStorage.getItem('artisan_session');
  let isValid = false;

  if (session) {
    try {
      const data = JSON.parse(atob(session));
      // Strict role and expiration validation
      if (data.role === 'Artisan' && data && typeof data.exp === 'number' && data.exp > Date.now()) {
        isValid = true;
      }
    } catch (e) {
      console.error("Session integrity check failed.");
      isValid = false;
    }
  }

  return isValid ? <>{children}</> : <Navigate to="/adminlogin" />;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['All', 'Affordable Hairs']);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncDatabase = async () => {
      try {
        // Fetch active artisan inventory from DB first
        const [data, cats] = await Promise.all([getProducts(), getCategories()]);

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Only sync initial inventory to Firestore if empty
          await seedDatabase(INITIAL_PRODUCTS);
          // Re-fetch after seeding
          const seededData = await getProducts();
          if (seededData && seededData.length > 0) setProducts(seededData);
        }

        if (cats && cats.length > 0) {
          setCategories(['All', ...cats]);
        }
      } catch (err: any) {
        console.warn("Vault sync unavailable, using internal registry:", err);
      } finally {
        setIsLoading(false);
      }
    };
    syncDatabase();
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CurrencyProvider>
      <Router>
        <ScrollToTop />
        <Layout cartCount={cartCount}>
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/shop" element={<Shop products={products} categories={categories} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} onAddToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults products={products} />} />
            <Route path="/returns" element={<ReturnsPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdmin>
                  <AdminDashboard refreshProducts={() => getProducts().then(data => data && data.length > 0 && setProducts(data))} />
                </ProtectedAdmin>
              }
            />

          </Routes>
        </Layout>
      </Router>
    </CurrencyProvider>
  );
};

export default App;