import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  IndianRupee,
  FileText,
  MessageSquareCode,
  GraduationCap,
  LifeBuoy,
  Wallet,
  Settings,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Bell
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { theme, toggleTheme, userProfile, isSyncing } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory Agent', path: '/inventory', icon: Boxes },
    { name: 'Invoice Agent', path: '/invoices', icon: FileSpreadsheet },
    { name: 'Finance Agent', path: '/finance', icon: IndianRupee },
    { name: 'Document Agent', path: '/documents', icon: FileText },
    { name: 'AI Chat Assistant', path: '/chat', icon: MessageSquareCode },
    { name: 'Scheme Advisor', path: '/schemes', icon: GraduationCap },
    { name: 'Customer Support', path: '/support', icon: LifeBuoy },
    { name: 'Wealth Advisor', path: '/wealth', icon: Wallet },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Show Admin link if user has Admin role
  if (userProfile?.role === 'Admin') {
    navigationItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  const activeItem = navigationItems.find((item) => item.path === location.pathname) || { name: 'Dashboard' };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 h-screen z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Business AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sync Status / Business Details */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            {import.meta.env.VITE_BYPASS_AUTH === 'true' ? (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                EP
              </div>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {userProfile?.businessId?.name || 'Apex Dynamics Enterprises'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {userProfile?.role || 'Business Owner'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backing */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-40 lg:hidden flex flex-col h-full"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                <Link to="/" className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Business AI</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  {import.meta.env.VITE_BYPASS_AUTH === 'true' ? (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                      EP
                    </div>
                  ) : (
                    <UserButton afterSignOutUrl="/" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                      {userProfile?.businessId?.name || 'Loading Enterprise...'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {userProfile?.role || 'Guest'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative h-screen">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{activeItem.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search shortcut bar (visual) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-500 cursor-pointer">
              <Search className="h-4 w-4" />
              <span className="text-xs font-medium">Search everywhere...</span>
              <kbd className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-700">⌘K</kbd>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notification Alert Toggle (visual bell) */}
            <div className="relative cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border border-white dark:border-slate-950" />
            </div>
          </div>
        </header>

        {/* Content Page Mounting */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isSyncing ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Syncing database...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
