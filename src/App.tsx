
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import './i18n';

const queryClient = new QueryClient();

const App = () => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Set RTL/LTR based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('ksatest-theme') as 'light' | 'dark';
    const savedLang = localStorage.getItem('ksatest-language');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) i18n.changeLanguage(savedLang);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(() => console.log('SW registration failed'));
    }
  }, [i18n, theme]);

  return (
    <div className={theme}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index theme={theme} setTheme={setTheme} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
