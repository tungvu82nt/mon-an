import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, Star, Clock, ShoppingBag, 
  User, Menu, Home, Heart, Bell, ChevronLeft, 
  Plus, Minus, CreditCard, CheckCircle, TrendingUp, 
  Users, MessageSquare, Calendar, Filter, X,
  Settings, LogOut, ChevronRight, Edit3, Trash2, Eye,
  Check, XCircle, MoreVertical, Facebook, Instagram, Twitter, AlertCircle,
  Sparkles, Globe, Shield, Moon, Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { View, Restaurant, MenuItem, CartItem, User as UserType } from './types';
import { CATEGORIES, MOCK_RESTAURANTS, MOCK_MENU } from './constants';
import { initializeGemini, getMealRecommendation } from './services/geminiService';

// --- SHARED TYPES & UTILS ---

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// --- COMPONENTS ---

const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-full transition-all duration-300 ${
            toast.type === 'success' ? 'bg-white border-l-4 border-green-500 text-gray-800' :
            toast.type === 'error' ? 'bg-white border-l-4 border-red-500 text-gray-800' :
            'bg-gray-900 text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
          {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
          <p className="text-sm font-medium">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}> = ({ children, variant = 'primary', className = '', onClick, fullWidth, disabled, loading }) => {
  const base = "px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30",
    secondary: "bg-gray-900 hover:bg-gray-800 text-white",
    outline: "border-2 border-gray-200 hover:border-brand-500 hover:text-brand-500 text-gray-700 bg-transparent",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }> = ({ icon, className, ...props }) => (
  <div className="relative w-full">
    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
    <input 
      className={`w-full bg-white border border-gray-200 rounded-xl py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${className}`}
      {...props} 
    />
  </div>
);

const Badge: React.FC<{ children: React.ReactNode, color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold ${colors[color]}`}>
      {children}
    </span>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="font-bold text-xl tracking-tight">FoodFinder</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Kết nối thực khách với những địa điểm ăn uống tuyệt vời nhất. Giao hàng nhanh chóng, món ăn nóng hổi.
          </p>
        </div>
        {/* ... Footer content same as before ... */}
        <div>
          <h4 className="font-bold text-lg mb-6">Liên hệ</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-brand-500" />
              123 Nguyễn Huệ, Quận 1, TP.HCM
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
        <p>© 2024 FoodFinder Vietnam. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const Navbar: React.FC<{ 
  currentView: View; 
  onNavigate: (v: View) => void;
  cartCount: number;
  userName: string;
  onLogout: () => void;
}> = ({ currentView, onNavigate, cartCount, userName, onLogout }) => {
  const [showNoti, setShowNoti] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) setShowNoti(false);
      if (userRef.current && !userRef.current.contains(event.target as Node)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(View.LANDING)}>
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">FoodFinder</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <button onClick={() => onNavigate(View.LANDING)} className={`hover:text-brand-500 transition-colors ${currentView === View.LANDING ? 'text-brand-500' : ''}`}>Trang chủ</button>
          <button onClick={() => onNavigate(View.MAP_DISCOVERY)} className={`hover:text-brand-500 transition-colors ${currentView === View.MAP_DISCOVERY ? 'text-brand-500' : ''}`}>Bản đồ</button>
          <button onClick={() => onNavigate(View.SEARCH_RESULTS)} className={`hover:text-brand-500 transition-colors ${currentView === View.SEARCH_RESULTS ? 'text-brand-500' : ''}`}>Nhà hàng</button>
        </div>

        <div className="flex items-center gap-3">
          {currentView === View.MERCHANT_DASHBOARD ? (
               <Button variant="ghost" onClick={() => onNavigate(View.LANDING)}>Exit Merchant</Button>
          ) : (
            <>
               {/* Notifications */}
               <div className="relative" ref={notiRef}>
                 <button 
                  className={`relative p-2 rounded-full transition-colors ${showNoti ? 'bg-brand-50 text-brand-500' : 'hover:bg-gray-100 text-gray-600'}`}
                  onClick={() => setShowNoti(!showNoti)}
                 >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 </button>
                 {showNoti && (
                   <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-3 border-b border-gray-50 font-bold text-gray-900">Thông báo</div>
                      <div className="p-4 text-sm text-gray-500">Bạn có 3 thông báo mới chưa đọc.</div>
                   </div>
                 )}
               </div>

              {/* Cart */}
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => onNavigate(View.CHECKOUT)}
              >
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {userName ? (
                <div className="relative ml-2" ref={userRef}>
                   <button 
                     onClick={() => setShowUserMenu(!showUserMenu)}
                     className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all"
                   >
                     <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                     </div>
                     <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[100px] truncate">{userName}</span>
                   </button>
                   
                   {showUserMenu && (
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 space-y-1">
                          <button onClick={() => { onNavigate(View.PROFILE); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                             <User size={16} /> Hồ sơ cá nhân
                          </button>
                          <button onClick={() => { onNavigate(View.MERCHANT_DASHBOARD); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                             <Home size={16} /> Kênh đối tác
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button onClick={() => { onLogout(); setShowUserMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2">
                             <LogOut size={16} /> Đăng xuất
                          </button>
                        </div>
                     </div>
                   )}
                </div>
              ) : (
                <button onClick={() => onNavigate(View.AUTH)} className="ml-2">
                  <Button variant="secondary" className="!py-2 !px-4 text-sm">Đăng nhập</Button>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- VIEWS ---

const LandingPage: React.FC<{ onNavigate: (v: View) => void, addToast: (msg: string) => void }> = ({ onNavigate, addToast }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAiSuggest = async () => {
    if (!aiPrompt) {
       addToast('Vui lòng nhập nội dung để AI gợi ý!');
       return;
    }
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setAiSuggestion("Dựa trên yêu cầu của bạn, tôi gợi ý bạn thử **Phở Thìn Lò Đúc** cho bữa nay!");
    } catch (e) {
      setAiSuggestion("AI đang bận, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[550px] md:h-[650px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-50"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl px-4 text-center space-y-6">
          <Badge color="yellow"><span className="flex items-center gap-1">✨ Tích hợp AI Gemini</span></Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Món ngon <span className="text-brand-500">nóng hổi</span><br/>giao đến tận tay bạn
          </h1>
          
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                placeholder="Hôm nay bạn muốn ăn gì? Hỏi AI ngay..." 
                className="w-full h-12 pl-10 pr-4 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <Button onClick={() => onNavigate(View.SEARCH_RESULTS)} className="md:w-auto w-full">
              Tìm kiếm
            </Button>
          </div>
          
          {/* AI Suggestion Button */}
          <div className="flex justify-center mt-4">
            <button 
              onClick={handleAiSuggest}
              disabled={isLoading}
              className="flex items-center gap-2 text-white/90 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all text-sm font-medium border border-white/20"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'text-yellow-400'}`} />
              {isLoading ? 'Đang suy nghĩ...' : 'AI Gợi ý món ngon'}
            </button>
          </div>
          
          {aiSuggestion && (
            <div className="max-w-xl mx-auto mt-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm animate-in fade-in slide-in-from-bottom-4">
              <p className="flex items-start gap-2 text-left">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                {aiSuggestion}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Danh mục nổi bật</h2>
          <button className="text-brand-500 font-medium hover:underline">Xem tất cả</button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onNavigate(View.SEARCH_RESULTS)}
              className="group cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-4xl group-hover:shadow-md group-hover:border-brand-200 group-hover:scale-105 transition-all duration-300">
                {cat.icon}
              </div>
              <span className="font-medium text-gray-700 group-hover:text-brand-600 transition-colors">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const AuthPage: React.FC<{ onNavigate: (v: View) => void, onLogin: (name: string) => void, addToast: (msg: string, t: ToastType) => void }> = ({ onNavigate, onLogin, addToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      addToast('Vui lòng nhập Email và Mật khẩu', 'error');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin("Nguyễn Văn Thực Thần");
      onNavigate(View.LANDING);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    addToast(`Đăng nhập bằng ${provider} đang được bảo trì`, 'info');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Background" />
        <div className="relative z-10 p-12 text-white max-w-xl">
          <h2 className="text-5xl font-bold mb-6">Thưởng thức trọn vẹn hương vị cuộc sống.</h2>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</h1>
            <p className="text-gray-500 mt-2">Nhập: admin@food.com / 123456</p>
          </div>
          
          <div className="space-y-4">
            <Input type="email" placeholder="Email của bạn" value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
            <Button fullWidth onClick={handleSubmit} loading={loading}>Đăng nhập</Button>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" onClick={() => handleSocialLogin('Google')}>Google</Button>
              <Button variant="outline" onClick={() => handleSocialLogin('Facebook')}>Facebook</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResults: React.FC<{ onNavigate: (v: View) => void, addToast: (msg: string) => void }> = ({ onNavigate, addToast }) => {
  const handleFilterClick = () => {
    addToast('Tính năng lọc nâng cao đang được cập nhật');
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 bg-gray-50">
       <div className="flex flex-1">
         {/* Filters Sidebar */}
         <aside className="hidden lg:block w-72 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto px-6 pb-6 scrollbar-hide">
           <div className="space-y-8">
             <div>
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Filter className="w-4 h-4" /> Bộ lọc
               </h3>
               <div className="space-y-3">
                 {['Đang mở cửa', 'Freeship', 'Ưu đãi đặc biệt'].map(label => (
                   <label key={label} className="flex items-center gap-3 cursor-pointer group">
                     <input type="checkbox" onChange={handleFilterClick} className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                     <span className="text-gray-700">{label}</span>
                   </label>
                 ))}
               </div>
             </div>
           </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 px-4 md:px-8 pb-12">
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl font-bold text-gray-900">Kết quả tìm kiếm</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_RESTAURANTS.map((res) => (
                <div 
                  key={res.id} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => onNavigate(View.RESTAURANT_DETAIL)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={res.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={res.name} />
                    <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className={`w-4 h-4 ${res.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-600 transition-colors">{res.name}</h3>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" /> {res.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>{res.tags.join(' • ')}</span>
                      <span>•</span>
                      <span>{res.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </main>
       </div>
       <Footer />
    </div>
  );
};

const RestaurantDetail: React.FC<{ addToCart: (item: MenuItem) => void, addToast: (msg: string) => void }> = ({ addToCart, addToast }) => {
  const [activeCategory, setActiveCategory] = useState('Phở');
  const restaurant = MOCK_RESTAURANTS[0];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Banner */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
          <img src={restaurant.image} className="w-full h-full object-cover" alt="Banner" />
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 z-20 text-white max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-4 text-sm md:text-base text-gray-200">
               <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /> {restaurant.rating} ({restaurant.reviewCount}+)</span>
               <span>•</span>
               <span>{restaurant.distance}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-8">
          <div className="flex-1">
            <div className="sticky top-20 z-30 bg-white pb-4 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
               <div className="flex gap-4 min-w-max">
                 {['Phở', 'Món kèm', 'Nước uống'].map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="grid gap-6">
              {MOCK_MENU.filter(m => activeCategory === 'Phở' ? m.category === 'Phở' : true).map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-brand-200 hover:shadow-md transition-all">
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                          <span className="font-bold text-brand-600">{item.price.toLocaleString()}đ</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="ghost" 
                        className="!p-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-full"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="w-5 h-5" /> Thêm
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Thông tin nhà hàng</h3>
                <div className="space-y-4">
                   <div className="flex items-start gap-3 text-gray-600 text-sm">
                     <MapPin className="w-5 h-5 shrink-0 text-brand-500" />
                     <p>13 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội</p>
                   </div>
                   <Button fullWidth variant="secondary" onClick={() => addToast('Đã gửi yêu cầu đặt chỗ đến nhà hàng')}>Đặt chỗ ngay</Button>
                </div>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Checkout: React.FC<{ 
  cart: CartItem[], 
  onNavigate: (v: View) => void,
  updateQuantity: (id: string, delta: number) => void,
  removeFromCart: (id: string) => void,
  clearCart: () => void
}> = ({ cart, onNavigate, updateQuantity, removeFromCart, clearCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleOrder = () => {
     setIsProcessing(true);
     setTimeout(() => {
       setIsProcessing(false);
       clearCart();
       onNavigate(View.ORDER_SUCCESS);
     }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Giỏ hàng trống</h2>
        <Button onClick={() => onNavigate(View.SEARCH_RESULTS)} className="mt-4">Khám phá ngay</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
           <div className="space-y-4">
             {cart.map((item) => (
               <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                 <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                 <div className="flex-1">
                   <h3 className="font-bold text-gray-900">{item.name}</h3>
                   <p className="text-sm text-brand-600 font-medium">{item.price.toLocaleString()}đ</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full hover:bg-gray-100"><Minus size={16} /></button>
                   <span className="font-medium w-6 text-center">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full hover:bg-gray-100"><Plus size={16} /></button>
                 </div>
                 <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
               </div>
             ))}
           </div>
        </div>
        {/* Payment & Address Forms (Simplified) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold text-gray-900 mb-4">Thanh toán</h2>
           <div className="space-y-3">
             <label className="flex items-center gap-3 p-4 border border-brand-500 bg-brand-50 rounded-xl cursor-pointer">
                 <input type="radio" name="payment" defaultChecked className="accent-brand-500 w-5 h-5" />
                 <span className="font-medium text-gray-700">Tiền mặt khi nhận hàng (COD)</span>
             </label>
           </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng cộng</h2>
           <div className="space-y-2 text-sm border-b border-gray-100 pb-4 mb-4">
             <div className="flex justify-between"><span>Tạm tính</span><span>{total.toLocaleString()}đ</span></div>
             <div className="flex justify-between"><span>Phí giao hàng</span><span>15,000đ</span></div>
           </div>
           <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
             <span>Tổng thanh toán</span>
             <span className="text-brand-600">{(total + 15000).toLocaleString()}đ</span>
           </div>
           <Button fullWidth size="lg" onClick={handleOrder} loading={isProcessing}>
             {isProcessing ? 'Đang xử lý...' : 'Đặt hàng ngay'}
           </Button>
        </div>
      </div>
    </div>
  );
};

const OrderSuccess: React.FC<{ onNavigate: (v: View) => void }> = ({ onNavigate }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
      <CheckCircle className="w-12 h-12 text-green-600" />
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
    <p className="text-gray-500 mb-8 max-w-md">Tài xế đang trên đường đến nhà hàng. Hãy chuẩn bị "tâm hồn đẹp" để thưởng thức nhé!</p>
    <div className="flex gap-4">
      <Button variant="outline" onClick={() => onNavigate(View.LANDING)}>Về trang chủ</Button>
      <Button onClick={() => onNavigate(View.MAP_DISCOVERY)}>Theo dõi đơn hàng</Button>
    </div>
  </div>
);

// --- MERCHANT SYSTEM ---

const MerchantDashboard: React.FC<{ addToast: (msg: string, type: ToastType) => void }> = ({ addToast }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'bookings' | 'reviews'>('overview');
  const [menuItems, setMenuItems] = useState(MOCK_MENU);
  const [bookings, setBookings] = useState([
    { id: 1, name: 'Nguyễn Văn A', time: '19:00', guests: 4, phone: '0912***789', status: 'pending' },
    { id: 2, name: 'Trần Thị B', time: '19:30', guests: 2, phone: '0988***123', status: 'confirmed' },
  ]);

  const handleDeleteItem = (id: string) => {
    if(window.confirm('Bạn có chắc muốn xóa món này?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      addToast('Đã xóa món ăn khỏi menu', 'success');
    }
  };

  const handleBookingAction = (id: number, action: 'confirm' | 'reject') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action === 'confirm' ? 'confirmed' : 'cancelled' } : b));
    addToast(action === 'confirm' ? 'Đã nhận bàn thành công' : 'Đã từ chối đặt bàn', action === 'confirm' ? 'success' : 'info');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'menu':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý Menu</h2>
              <Button onClick={() => addToast('Tính năng thêm món đang phát triển', 'info')}><Plus className="w-4 h-4" /> Thêm món mới</Button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                   <tr>
                     <th className="px-6 py-4 font-semibold">Món ăn</th>
                     <th className="px-6 py-4 font-semibold">Giá</th>
                     <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {menuItems.map((item) => (
                     <tr key={item.id} className="hover:bg-gray-50/50">
                       <td className="px-6 py-4 flex items-center gap-3">
                           <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                           <span className="font-medium text-gray-900">{item.name}</span>
                       </td>
                       <td className="px-6 py-4 text-sm font-medium">{item.price.toLocaleString()}đ</td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                           <button className="p-1 text-gray-400 hover:text-brand-500"><Edit3 className="w-4 h-4" /></button>
                           <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {menuItems.length === 0 && <div className="p-8 text-center text-gray-500">Menu trống</div>}
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h2 className="text-2xl font-bold text-gray-900">Quản lý Đặt bàn</h2>
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">{booking.name.charAt(0)}</div>
                     <div><h4 className="font-bold text-gray-900">{booking.name}</h4><p className="text-sm text-gray-500">{booking.phone}</p></div>
                   </div>
                   <div className="flex items-center gap-6">
                     <div className="text-center"><p className="text-xs text-gray-400 uppercase">Giờ đến</p><p className="font-bold text-gray-900 text-lg">{booking.time}</p></div>
                     <div className="text-center"><p className="text-xs text-gray-400 uppercase">Trạng thái</p>
                       {booking.status === 'pending' && <Badge color="yellow">Chờ duyệt</Badge>}
                       {booking.status === 'confirmed' && <Badge color="green">Đã nhận</Badge>}
                       {booking.status === 'cancelled' && <Badge color="red">Đã hủy</Badge>}
                     </div>
                   </div>
                   {booking.status === 'pending' && (
                     <div className="flex gap-2">
                       <Button variant="primary" onClick={() => handleBookingAction(booking.id, 'confirm')} className="!bg-green-500"><Check className="w-4 h-4" /> Nhận</Button>
                       <Button variant="danger" onClick={() => handleBookingAction(booking.id, 'reject')}><XCircle className="w-4 h-4" /> Từ chối</Button>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        );
      // Other tabs remain similar...
      default: return <div className="p-8 text-center text-gray-500">Overview Dashboard (Visual Only)</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
       <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col fixed inset-y-0">
          <div className="h-16 flex items-center px-6 border-b border-gray-100"><span className="text-brand-600 font-bold text-xl">Merchant Portal</span></div>
          <div className="flex-1 py-6 px-3 space-y-1">
             {[{id:'overview', icon:<Home size={20}/>, label:'Tổng quan'}, {id:'menu', icon:<Menu size={20}/>, label:'Menu'}, {id:'bookings', icon:<Calendar size={20}/>, label:'Đặt bàn'}].map(item => (
               <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}>{item.icon} {item.label}</button>
             ))}
          </div>
       </aside>
       <main className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-8">{renderContent()}</main>
    </div>
  );
};

const UserProfile: React.FC<{ 
  onNavigate: (v: View) => void, 
  userName: string, 
  onUpdateName: (n: string) => void,
  addToast: (m: string, t: ToastType) => void
}> = ({ onNavigate, userName, onUpdateName, addToast }) => {
  const [name, setName] = useState(userName);
  
  const handleSave = () => {
    onUpdateName(name);
    addToast('Đã cập nhật thông tin thành công!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Chỉnh sửa thông tin</h2>
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
               </div>
               <div className="pt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => onNavigate(View.LANDING)}>Hủy</Button>
                  <Button onClick={handleSave}>Lưu thay đổi</Button>
               </div>
            </div>
         </div>
      </div>
      <Footer />
    </div>
  );
};

// --- MAP PLACEHOLDER ---
const MapDiscovery: React.FC = () => (
  <div className="relative h-[calc(100vh-64px)] w-full bg-gray-200 flex items-center justify-center">
    <div className="text-center p-8 text-gray-500">
      <MapPin size={64} className="mx-auto mb-4" />
      <h2 className="text-2xl font-bold">Map Interactive Mode</h2>
      <p>Google Maps / Mapbox integration would render here.</p>
    </div>
  </div>
);

// --- APP ROOT ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState<string>(''); // Empty = Not logged in
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast Helper
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  // Cart Helpers
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    addToast(`Đã thêm ${item.name} vào giỏ`, 'success');
  };
  
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };
  
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Đã xóa món khỏi giỏ hàng', 'info');
  };

  const clearCart = () => setCart([]);

  // Auth Helpers
  const handleLogin = (name: string) => {
    setUserName(name);
    addToast(`Chào mừng ${name} quay trở lại!`, 'success');
  };

  const handleLogout = () => {
    setUserName('');
    setCart([]);
    setCurrentView(View.LANDING);
    addToast('Đã đăng xuất', 'info');
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING: return <LandingPage onNavigate={setCurrentView} addToast={addToast} />;
      case View.AUTH: return <AuthPage onNavigate={setCurrentView} onLogin={handleLogin} addToast={addToast} />;
      case View.SEARCH_RESULTS: return <SearchResults onNavigate={setCurrentView} addToast={addToast} />;
      case View.RESTAURANT_DETAIL: return <RestaurantDetail addToCart={addToCart} addToast={addToast} />;
      case View.CHECKOUT: return <Checkout cart={cart} onNavigate={setCurrentView} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />;
      case View.ORDER_SUCCESS: return <OrderSuccess onNavigate={setCurrentView} />;
      case View.MERCHANT_DASHBOARD: return <MerchantDashboard addToast={addToast} />;
      case View.MAP_DISCOVERY: return <MapDiscovery />;
      case View.PROFILE: return <UserProfile onNavigate={setCurrentView} userName={userName} onUpdateName={setUserName} addToast={addToast} />;
      default: return <LandingPage onNavigate={setCurrentView} addToast={addToast} />;
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {currentView !== View.AUTH && (
        <Navbar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
          cartCount={cart.reduce((a,b) => a+b.quantity, 0)} 
          userName={userName}
          onLogout={handleLogout}
        />
      )}
      {renderView()}
    </div>
  );
}