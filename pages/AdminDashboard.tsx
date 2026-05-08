import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Order } from '../types';
import {
  Package,
  ShoppingBag,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Box,
  X,
  Save,
  Video,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  LayoutDashboard,
  Menu,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { getProducts, saveProduct, deleteProduct, getOrders, updateOrderStatus, uploadFileAdmin, seedDatabase, getCategories, saveCategory, deleteCategory } from '../services/firebase';
import { INITIAL_PRODUCTS } from '../data';

interface AdminDashboardProps {
  refreshProducts: () => void;
}

type TabType = 'dashboard' | 'inventory' | 'orders';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ refreshProducts }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [manageProductsOpen, setManageProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Affordable Hairs']);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Product Editor Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-expand Manage Products when inventory tab is active
  useEffect(() => {
    if (activeTab === 'inventory') setManageProductsOpen(true);
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    const [p, o, c] = await Promise.all([getProducts(), getOrders(), getCategories()]);
    setProducts(p);
    setOrders(o);
    setCategories(c);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('artisan_session');
    navigate('/chixatadminlogin');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently remove this product?')) {
      await deleteProduct(id);
      loadData();
      refreshProducts();
    }
  };

  const openEditor = (product: Product | null = null) => {
    setEditingProduct(product || {
      name: '',
      category: categories[0] || 'Affordable Hairs',
      price: 0,
      description: '',
      images: ['', '', ''],
      video: '',
      stock: 10,
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const base64 = await uploadFileAdmin(file, file.name);
      if (editingProduct) {
        const newImages = [...(editingProduct.images || ['', '', ''])];
        newImages[index] = base64;
        setEditingProduct({ ...editingProduct, images: newImages });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert("Upload failed: " + (error?.message || "Please check your connection and try again."));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || isUploading) return;
    const cleanedImages = (editingProduct.images || []).filter(img => img.trim() !== '');
    if (cleanedImages.length === 0) return alert('At least one image is required.');
    try {
      await saveProduct({ ...editingProduct, images: cleanedImages });
      setIsModalOpen(false);
      loadData();
      refreshProducts();
      alert('Product saved successfully!');
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Failed to save product: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleManualSync = async () => {
    if (!confirm('This will sync all products defined in the code to your database. Continue?')) return;
    setLoading(true);
    try {
      await seedDatabase(INITIAL_PRODUCTS);
      await loadData();
      alert('Sync completed successfully!');
    } catch (err) {
      alert('Sync failed: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    loadData();
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      await saveCategory(newCatName.trim());
      setNewCatName('');
      const updatedCats = await getCategories();
      setCategories(updatedCats);
    } catch {
      alert("Failed to add category.");
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (cat === 'Affordable Hairs') return alert("Cannot delete primary category.");
    if (!confirm(`Delete category "${cat}"? Products in this category will remain but will have no assigned category.`)) return;
    await deleteCategory(cat);
    const updatedCats = await getCategories();
    setCategories(updatedCats);
  };

  const navigateTab = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Computed stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const recentOrders = orders.slice(0, 5);

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  products.forEach(p => {
    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
  });

  // ─── Sidebar content (shared between desktop and mobile drawer) ───
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/5">
        <img src="https://i.ibb.co/gFrtgKdc/Chixat-Hair.png" alt="Chixat Hair" className="h-16 brightness-0 invert mx-auto" />
        <div className="mt-4 flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-grow p-5 space-y-1.5 overflow-y-auto">
        {/* Dashboard */}
        <button
          onClick={() => navigateTab('dashboard')}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard'
            ? 'bg-brand text-white shadow-[0_8px_20px_rgba(174,122,39,0.3)]'
            : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>

        {/* Manage Products (collapsible) */}
        <div>
          <button
            onClick={() => setManageProductsOpen(!manageProductsOpen)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory'
              ? 'bg-brand text-white shadow-[0_8px_20px_rgba(174,122,39,0.3)]'
              : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Package className="w-4 h-4" />
            <span className="flex-1 text-left">Manage Products</span>
            {manageProductsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {manageProductsOpen && (
            <div className="ml-9 mt-1 space-y-0.5 border-l border-white/10 pl-4">
              <button
                onClick={() => navigateTab('inventory')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'text-brand' : 'text-white/30 hover:text-white/70'
                  }`}
              >
                <Box className="w-3.5 h-3.5" /> Inventory
              </button>
              <button
                onClick={() => {
                  openEditor();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white/70 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Product
              </button>
            </div>
          )}
        </div>

        {/* Orders */}
        <button
          onClick={() => navigateTab('orders')}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders'
            ? 'bg-brand text-white shadow-[0_8px_20px_rgba(174,122,39,0.3)]'
            : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="flex-1 text-left">Orders</span>
          {pendingOrders > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-black">{pendingOrders}</span>
          )}
        </button>
      </nav>

      {/* Logout — always visible at bottom */}
      <div className="p-5 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </>
  );

  // ─── Dashboard Stats View ───
  const DashboardView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic tracking-tight text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time stats for your Chixat Hair store.</p>
      </div>

      {/* Stats Grid — 3×2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-brand/10 w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5 text-brand" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Revenue</h3>
          <p className="text-2xl font-black italic">₦{totalRevenue.toLocaleString()}</p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-black/5 w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5 text-black" />
            </div>
            <span className="text-[9px] font-black text-gray-300">{Object.keys(categoryBreakdown).length} categories</span>
          </div>
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Products</h3>
          <p className="text-2xl font-black italic">{products.length}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-orange-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            {pendingOrders > 0 && <span className="w-5 h-5 bg-orange-500 text-white text-[8px] rounded-full flex items-center justify-center font-black animate-pulse">{pendingOrders}</span>}
          </div>
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Pending Orders</h3>
          <p className="text-2xl font-black italic">{pendingOrders}</p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-green-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Delivered Orders</h3>
          <p className="text-2xl font-black italic">{deliveredOrders}</p>
        </div>

        {/* Low Stock */}
        <div className={`bg-white p-6 rounded-3xl shadow-sm border group transition-all ${lowStockProducts.length > 0 ? 'border-red-200 hover:border-red-300' : 'border-gray-100 hover:border-brand/30'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${lowStockProducts.length > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <AlertTriangle className={`w-5 h-5 ${lowStockProducts.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            {lowStockProducts.length > 0 && <span className="text-[8px] font-black text-red-500 uppercase tracking-wider animate-pulse">Attention</span>}
          </div>
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Low Stock Alerts</h3>
          <p className="text-2xl font-black italic">{lowStockProducts.length}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Orders</h3>
          <p className="text-2xl font-black italic">{orders.length}</p>
        </div>
      </div>

      {/* Two-column layout: Recent Orders + Low Stock / Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-black italic">Recent Orders</h3>
            <button onClick={() => setActiveTab('orders')} className="text-[9px] font-black uppercase tracking-widest text-brand hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 && (
              <div className="p-8 text-center text-gray-300 text-sm">No orders yet.</div>
            )}
            {recentOrders.map(order => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{order.customerName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{order.createdAt}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-black">₦{order.totalAmount.toLocaleString()}</p>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                      order.status === 'Processing' ? 'bg-purple-50 text-purple-600' :
                        'bg-orange-50 text-orange-600'
                    }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Low Stock + Category */}
        <div className="space-y-6">
          {/* Low Stock Products */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-black italic">Low Stock Products</h3>
              {lowStockProducts.length > 0 && (
                <span className="text-[8px] font-black text-red-500 uppercase tracking-wider bg-red-50 px-2 py-1 rounded-full">{lowStockProducts.length} items</span>
              )}
            </div>
            <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
              {lowStockProducts.length === 0 && (
                <div className="p-6 text-center text-gray-300 text-sm">All products are well stocked 🎉</div>
              )}
              {lowStockProducts.map(p => (
                <div key={p.id} className="px-6 py-3 flex items-center justify-between hover:bg-red-50/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.images[0]} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="" />
                    <span className="text-xs font-bold text-gray-900 truncate">{p.name}</span>
                  </div>
                  <span className="text-[9px] font-black text-red-500 ml-2 shrink-0">{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h3 className="text-sm font-black italic flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand" /> Category Breakdown
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700">{cat}</span>
                      <span className="text-[9px] font-black text-gray-400">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {Object.keys(categoryBreakdown).length === 0 && (
                <p className="text-center text-gray-300 text-sm">No products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#fcfbf7] font-['Poppins']">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-64 bg-[#0a0a0a] text-white flex-col sticky top-0 h-screen hidden lg:flex shadow-2xl">
        <SidebarContent />
      </aside>

      {/* ─── Mobile Drawer Overlay ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 max-w-[80vw] h-full bg-[#0a0a0a] text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 italic tracking-tighter">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'inventory' ? 'Inventory' : 'Orders'}
            </h1>
            <p className="text-gray-400 font-medium text-xs md:text-sm mt-1 hidden sm:block">Chixat Hair Admin</p>
          </div>

          <div className="flex gap-3 shrink-0">
            {activeTab === 'inventory' && (
              <>
                <button
                  onClick={handleManualSync}
                  className="btn-press bg-white border border-gray-200 text-gray-600 px-4 md:px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-brand" /> <span className="hidden md:inline">Force Sync</span>
                </button>
                <button
                  onClick={() => openEditor()}
                  className="btn-press bg-black text-white px-4 md:px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-brand transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> <span className="hidden md:inline">Add Product</span>
                </button>
              </>
            )}
            {/* Mobile logout shortcut */}
            <button
              onClick={handleLogout}
              className="lg:hidden p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-red-50 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            {/* ─── Dashboard View ─── */}
            {activeTab === 'dashboard' && <DashboardView />}

            {/* ─── Inventory View ─── */}
            {activeTab === 'inventory' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                  <h2 className="text-lg font-black italic tracking-tight">Product Inventory</h2>
                  <div className="relative">
                    <input type="text" placeholder="Search..." className="bg-white border border-gray-100 rounded-full px-8 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-brand/20 w-40 md:w-56" />
                    <Box className="w-3.5 h-3.5 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Product</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hidden md:table-cell">Category</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Stock</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/40 transition-all group">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 shrink-0 group-hover:scale-105 transition-transform">
                                <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-gray-900 truncate">{product.name}</h4>
                                <p className="text-brand text-xs font-semibold">₦{product.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 hidden md:table-cell">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">{product.category}</span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                              <span className={`text-[9px] font-black uppercase tracking-widest ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditor(product)} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-brand hover:text-white transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(product.id)} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── Orders View ─── */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                  <h2 className="text-lg font-black italic tracking-tight">Order History</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Ref</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hidden md:table-cell">Customer</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Amount</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right hidden sm:table-cell">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/40 transition-all">
                          <td className="px-6 py-4">
                            <span className="font-mono text-[10px] font-black text-brand bg-brand/10 px-2.5 py-1 rounded-full uppercase">{order.id.slice(-8)}</span>
                            <p className="text-[8px] text-gray-400 mt-1.5 font-bold uppercase tracking-widest">{order.createdAt}</p>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className="font-bold text-sm text-gray-900">{order.customerName}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{order.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                              className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-transparent outline-none cursor-pointer transition-all ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                  order.status === 'Processing' ? 'bg-purple-50 text-purple-600' :
                                    'bg-brand/10 text-brand'
                                }`}
                            >
                              <option>Pending</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 font-black text-sm">₦{order.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right hidden sm:table-cell">
                            <button className="text-[9px] font-black uppercase tracking-[0.15em] text-brand hover:underline flex items-center gap-1 ml-auto">
                              Details <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center">
                            <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm font-medium">No orders yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── Product Editor Modal ─── */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl" onClick={() => !isUploading && setIsModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
                <p className="text-brand text-[9px] font-black uppercase tracking-[0.4em] mt-1">Product Management</p>
              </div>
              <button onClick={() => !isUploading && setIsModalOpen(false)} className="p-3 bg-white rounded-full shadow-lg hover:rotate-90 transition-all border border-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 no-scrollbar">
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Product Name</label>
                  <input
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-sm transition-all"
                    placeholder='e.g., Kamdili 32" Midnight Black'
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-2xl outline-none appearance-none font-medium text-sm cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Category Management</p>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="New Category..."
                          className="flex-grow bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          disabled={isAddingCat}
                          className="p-2 bg-black text-white rounded-xl hover:bg-brand transition-colors disabled:bg-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <div key={cat} className="flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">
                            {cat}
                            {cat !== 'Affordable Hairs' && (
                              <button type="button" onClick={() => handleDeleteCategory(cat)} className="hover:text-red-500 transition-colors">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Price (₦)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-sm transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Description</label>
                  <textarea
                    rows={4}
                    required
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium text-sm resize-none transition-all leading-relaxed"
                    placeholder="Describe the product..."
                  />
                </div>

                <div className="p-5 bg-brand/5 rounded-2xl border border-brand/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="w-5 h-5 rounded border-brand text-brand focus:ring-brand"
                    />
                    <label htmlFor="featured" className="text-[9px] font-black uppercase tracking-[0.2em] text-brand">Featured Product</label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Stock Quantity</span>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-20 bg-white border border-gray-100 px-4 py-2 rounded-xl outline-none font-black text-center text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Media */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" /> Product Images (3 max)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="relative aspect-[3/4] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden group">
                        {editingProduct.images?.[idx] ? (
                          <>
                            <img src={editingProduct.images[idx]} className="w-full h-full object-cover" alt="" />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...(editingProduct.images || ['', '', ''])];
                                newImages[idx] = '';
                                setEditingProduct({ ...editingProduct, images: newImages });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors gap-2">
                            <Upload className="w-5 h-5 text-gray-300" />
                            <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">{idx === 0 ? 'COVER' : 'IMG ' + (idx + 1)}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                               onChange={(e) => handleFileUpload(e, idx)}
                              disabled={isUploading}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                    <Video className="w-3.5 h-3.5" /> Video URL (optional)
                  </label>
                  {editingProduct.video ? (
                    <div className="relative aspect-video bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden group">
                      <video src={editingProduct.video} className="w-full h-full object-cover" controls />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, video: '' })}
                          className="bg-white text-black px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={editingProduct.video || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, video: e.target.value })}
                      placeholder="https://vimeo.com/... or youtube.com/watch?v=..."
                      className="w-full bg-gray-50 border border-gray-100 px-5 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                    />
                  )}
                  <p className="text-[7px] text-gray-400 uppercase tracking-widest text-center">Videos hosted on Vimeo, YouTube, etc. Paste the share URL.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-black text-white py-4 rounded-full font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-brand transition-all shadow-lg disabled:bg-gray-200"
                  >
                    {isUploading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Product</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;