import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Youtube, LayoutDashboard, CreditCard, LogOut, Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Tools', path: '/', icon: Youtube },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, auth: true },
    { name: 'Profile', path: '/profile', icon: User, auth: true },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-1.5 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight hidden sm:block">YTGrowth<span className="text-red-600">AI</span></span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                (!item.auth || user) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-red-500",
                      location.pathname === item.path ? "text-red-500" : "text-zinc-400"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <Link to="/profile" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 group-hover:border-red-500/50 transition-all">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden lg:block">{profile?.displayName || user.email}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                (!item.auth || user) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium",
                      location.pathname === item.path ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-zinc-900"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-red-600 rounded-md">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">YTGrowth<span className="text-red-600">AI</span></span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-zinc-500">© 2026 YTGrowthAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
