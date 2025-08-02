import React, { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Settings, HelpCircle } from 'lucide-react';
import { t, getCurrentLanguage } from '../utils/language';

const Header = ({ currentPage, onNavigate }) => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage());
    };

    const handleCustomLanguageChange = () => {
      setCurrentLang(getCurrentLanguage());
    };

    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('languageChanged', handleCustomLanguageChange);
    
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('languageChanged', handleCustomLanguageChange);
    };
  }, []);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img 
                src="/images/is-bg-tras.logo.png" 
                alt="InduSign Logo" 
                className="w-8 h-8"
              />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentPage === 'dashboard' ? t('dashboard') : 
                 currentPage === 'docrepo' ? t('docrepo') :
                 currentPage === 'settings' ? t('settings') :
                 currentPage === 'help' ? t('help') : t('dashboard')}
              </h1>
              <p className="text-sm text-gray-600">Acme Corporation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Menu Items */}
            <div className="flex items-center space-x-4">
              {[
                { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
                { id: 'docrepo', label: t('docrepo'), icon: FileText },
                { id: 'settings', label: t('settings'), icon: Settings },
                { id: 'help', label: t('help'), icon: HelpCircle }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('rememberMe');
                onNavigate('login');
              }}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 