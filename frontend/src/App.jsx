import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Finance from './pages/Finance';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import Schemes from './pages/Schemes';
import Support from './pages/Support';
import WealthAdvisor from './pages/WealthAdvisor';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/support" element={<Support />} />
            <Route path="/wealth" element={<WealthAdvisor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;


