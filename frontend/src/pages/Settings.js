import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, CreditCard, FileText, Building, Shield, Bell, Palette, Globe, Key } from 'lucide-react';
import { switchLanguage, initializeLanguage } from '../utils/language';

const Settings = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    colorScheme: 'blue',
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    highContrast: false,
    showTooltips: true,
    showBreadcrumbs: true,
    showIcons: true
  });

  // Language settings state
  const [languageSettings, setLanguageSettings] = useState({
    language: 'en',
    timezone: 'IST',
    dateFormat: 'dd/mm/yyyy',
    currency: 'INR',
    numberFormat: 'indian'
  });

  // Mock user data
  const [userData, setUserData] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: null
    },
    company: {
      name: 'Acme Corporation',
      address: '123 Business St, Suite 100',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      website: 'www.acmecorp.com',
      taxId: '12-3456789'
    },
    subscription: {
      plan: 'Professional',
      status: 'Active',
      nextBilling: '2024-02-15',
      amount: '₹2,499/month',
      features: ['Unlimited Documents', 'Advanced Signatures', 'Team Collaboration', 'API Access']
    },
    payment: {
      method: 'Visa ending in 4242',
      expiry: '12/25',
      billingAddress: '123 Business St, New York, NY 10001'
    }
  });

  const [signatures, setSignatures] = useState([
    { id: 1, name: 'John Doe', type: 'Default', createdAt: '2024-01-15' },
    { id: 2, name: 'John Doe - Formal', type: 'Formal', createdAt: '2024-01-10' },
    { id: 3, name: 'JD Initials', type: 'Initials', createdAt: '2024-01-05' }
  ]);

  // Load appearance settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setAppearanceSettings(parsedSettings);
      applyAppearanceSettings(parsedSettings);
    }
  }, []);

  // Apply appearance settings to the document
  const applyAppearanceSettings = (settings) => {
    const root = document.documentElement;
    
    // Apply theme
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${settings.theme}`);
    
    // Apply color scheme
    root.classList.remove('color-blue', 'color-green', 'color-purple', 'color-orange');
    root.classList.add(`color-${settings.colorScheme}`);
    
    // Apply font size
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    root.classList.add(`text-${settings.fontSize}`);
    
    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply animations
    if (!settings.showAnimations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  };

  // Handle appearance setting changes
  const handleAppearanceChange = (setting, value) => {
    const newSettings = { ...appearanceSettings, [setting]: value };
    setAppearanceSettings(newSettings);
    applyAppearanceSettings(newSettings);
    localStorage.setItem('appearanceSettings', JSON.stringify(newSettings));
  };

  // Reset appearance settings to default
  const resetAppearanceSettings = () => {
    const defaultSettings = {
      theme: 'light',
      colorScheme: 'blue',
      fontSize: 'medium',
      compactMode: false,
      showAnimations: true,
      highContrast: false,
      showTooltips: true,
      showBreadcrumbs: true,
      showIcons: true
    };
    setAppearanceSettings(defaultSettings);
    applyAppearanceSettings(defaultSettings);
    localStorage.setItem('appearanceSettings', JSON.stringify(defaultSettings));
  };

  // Load language settings from localStorage on component mount
  useEffect(() => {
    const savedLanguageSettings = localStorage.getItem('languageSettings');
    if (savedLanguageSettings) {
      const parsedSettings = JSON.parse(savedLanguageSettings);
      setLanguageSettings(parsedSettings);
      applyLanguageSettings(parsedSettings);
    }
  }, []);

  // Apply language settings to the application
  const applyLanguageSettings = (settings) => {
    const root = document.documentElement;
    
    // Apply language
    root.classList.remove('lang-en', 'lang-hi');
    root.classList.add(`lang-${settings.language}`);
    
    // Store current language in localStorage for other components
    localStorage.setItem('currentLanguage', settings.language);
    
    // Apply timezone
    localStorage.setItem('timezone', settings.timezone);
    
    // Apply date format
    localStorage.setItem('dateFormat', settings.dateFormat);
    
    // Apply currency
    localStorage.setItem('currency', settings.currency);
    
    // Apply number format
    localStorage.setItem('numberFormat', settings.numberFormat);
  };

  // Handle language setting changes
  const handleLanguageChange = (setting, value) => {
    const newSettings = { ...languageSettings, [setting]: value };
    setLanguageSettings(newSettings);
    applyLanguageSettings(newSettings);
    localStorage.setItem('languageSettings', JSON.stringify(newSettings));
    
    // Use the language utility to switch language
    if (setting === 'language') {
      switchLanguage(value);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'signatures', label: 'Signatures', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'api', label: 'API Keys', icon: Key }
  ];

  const handleSave = (section, data) => {
    setUserData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setIsEditing(false);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={userData.profile.firstName}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              profile: { ...prev.profile, firstName: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={userData.profile.lastName}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              profile: { ...prev.profile, lastName: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userData.profile.email}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              profile: { ...prev.profile, email: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={userData.profile.phone}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              profile: { ...prev.profile, phone: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('profile', userData.profile)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderCompanySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={userData.company.name}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, name: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={userData.company.address}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, address: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={userData.company.city}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, city: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={userData.company.state}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, state: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            value={userData.company.zipCode}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, zipCode: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={userData.company.country}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, country: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={userData.company.website}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, website: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
          <input
            type="text"
            value={userData.company.taxId}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              company: { ...prev.company, taxId: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('company', userData.company)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderSubscriptionSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Subscription Details</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Upgrade Plan
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current Plan</h4>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">{userData.subscription.plan}</p>
              <p className="text-sm text-gray-600">{userData.subscription.amount}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {userData.subscription.status}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Billing Information</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Next billing: {userData.subscription.nextBilling}</p>
              <p>Payment method: {userData.payment.method}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
          <ul className="space-y-2">
            {userData.subscription.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPaymentSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Payment Method
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{userData.payment.method}</p>
                <p className="text-sm text-gray-600">Expires {userData.payment.expiry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Default
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Billing Address</h4>
            <p className="text-sm text-gray-600">{userData.payment.billingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignaturesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">My Signatures</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Signature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signatures.map((sig) => (
          <div key={sig.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{sig.name}</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                sig.type === 'Default' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {sig.type}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded p-3 mb-3 bg-gray-50 h-16 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {sig.createdAt}</span>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-700">Edit</button>
                <button className="text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enable
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Change
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Session Management</h4>
              <p className="text-sm text-gray-600">View and manage active sessions</p>
            </div>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Document Signing</h4>
              <p className="text-sm text-gray-600">Notifications when documents are signed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Billing Reminders</h4>
              <p className="text-sm text-gray-600">Payment due and subscription updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
        <button 
          onClick={resetAppearanceSettings}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reset to Default
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="theme" 
                value="light" 
                checked={appearanceSettings.theme === 'light'}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-4 hover:border-blue-500 transition-colors ${
                appearanceSettings.theme === 'light' ? 'border-blue-500' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    {appearanceSettings.theme === 'light' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">Light</span>
                </div>
                <div className="bg-gray-50 rounded p-3 h-16 flex items-center justify-center">
                  <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Clean, bright interface</p>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="theme" 
                value="dark" 
                checked={appearanceSettings.theme === 'dark'}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-4 hover:border-blue-500 transition-colors ${
                appearanceSettings.theme === 'dark' ? 'border-blue-500' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    {appearanceSettings.theme === 'dark' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">Dark</span>
                </div>
                <div className="bg-gray-900 rounded p-3 h-16 flex items-center justify-center">
                  <div className="w-full h-8 bg-gray-800 border border-gray-700 rounded"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Easy on the eyes</p>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="theme" 
                value="auto" 
                checked={appearanceSettings.theme === 'auto'}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-4 hover:border-blue-500 transition-colors ${
                appearanceSettings.theme === 'auto' ? 'border-blue-500' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    {appearanceSettings.theme === 'auto' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">Auto</span>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-900 rounded p-3 h-16 flex items-center justify-center">
                  <div className="w-full h-8 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Follows system preference</p>
              </div>
            </label>
          </div>
        </div>

        {/* Color Scheme */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Color Scheme</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="colorScheme" 
                value="blue" 
                checked={appearanceSettings.colorScheme === 'blue'}
                onChange={(e) => handleAppearanceChange('colorScheme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-3 hover:border-blue-600 transition-colors ${
                appearanceSettings.colorScheme === 'blue' ? 'border-blue-500' : 'border-gray-200'
              }`}>
                <div className="w-full h-8 bg-blue-600 rounded mb-2"></div>
                <span className="text-sm font-medium text-gray-900">Blue</span>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="colorScheme" 
                value="green" 
                checked={appearanceSettings.colorScheme === 'green'}
                onChange={(e) => handleAppearanceChange('colorScheme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-3 hover:border-green-500 transition-colors ${
                appearanceSettings.colorScheme === 'green' ? 'border-green-500' : 'border-gray-200'
              }`}>
                <div className="w-full h-8 bg-green-600 rounded mb-2"></div>
                <span className="text-sm font-medium text-gray-900">Green</span>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="colorScheme" 
                value="purple" 
                checked={appearanceSettings.colorScheme === 'purple'}
                onChange={(e) => handleAppearanceChange('colorScheme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-3 hover:border-purple-500 transition-colors ${
                appearanceSettings.colorScheme === 'purple' ? 'border-purple-500' : 'border-gray-200'
              }`}>
                <div className="w-full h-8 bg-purple-600 rounded mb-2"></div>
                <span className="text-sm font-medium text-gray-900">Purple</span>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input 
                type="radio" 
                name="colorScheme" 
                value="orange" 
                checked={appearanceSettings.colorScheme === 'orange'}
                onChange={(e) => handleAppearanceChange('colorScheme', e.target.value)}
                className="sr-only" 
              />
              <div className={`border-2 rounded-lg p-3 hover:border-orange-500 transition-colors ${
                appearanceSettings.colorScheme === 'orange' ? 'border-orange-500' : 'border-gray-200'
              }`}>
                <div className="w-full h-8 bg-orange-600 rounded mb-2"></div>
                <span className="text-sm font-medium text-gray-900">Orange</span>
              </div>
            </label>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Font Size</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="fontSize" 
                value="small" 
                checked={appearanceSettings.fontSize === 'small'}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                className="text-blue-600" 
              />
              <span className="text-sm">Small</span>
              <span className="text-xs text-gray-500">(12px)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="fontSize" 
                value="medium" 
                checked={appearanceSettings.fontSize === 'medium'}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                className="text-blue-600" 
              />
              <span className="text-sm">Medium</span>
              <span className="text-xs text-gray-500">(14px)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="fontSize" 
                value="large" 
                checked={appearanceSettings.fontSize === 'large'}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                className="text-blue-600" 
              />
              <span className="text-sm">Large</span>
              <span className="text-xs text-gray-500">(16px)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="fontSize" 
                value="extra-large" 
                checked={appearanceSettings.fontSize === 'extra-large'}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                className="text-blue-600" 
              />
              <span className="text-sm">Extra Large</span>
              <span className="text-xs text-gray-500">(18px)</span>
            </label>
          </div>
        </div>

        {/* Layout Options */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Layout Options</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Compact Mode</h5>
                <p className="text-sm text-gray-600">Reduce spacing for more content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={appearanceSettings.compactMode}
                  onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  appearanceSettings.compactMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Show Animations</h5>
                <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={appearanceSettings.showAnimations}
                  onChange={(e) => handleAppearanceChange('showAnimations', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  appearanceSettings.showAnimations ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">High Contrast</h5>
                <p className="text-sm text-gray-600">Increase contrast for better readability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={appearanceSettings.highContrast}
                  onChange={(e) => handleAppearanceChange('highContrast', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  appearanceSettings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Interface Elements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Interface Elements</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Show Tooltips</h5>
                <p className="text-sm text-gray-600">Display helpful hints on hover</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={appearanceSettings.showTooltips}
                  onChange={(e) => handleAppearanceChange('showTooltips', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  appearanceSettings.showTooltips ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Breadcrumb Navigation</h5>
                <p className="text-sm text-gray-600">Show navigation breadcrumbs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={appearanceSettings.showBreadcrumbs}
                  onChange={(e) => handleAppearanceChange('showBreadcrumbs', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  appearanceSettings.showBreadcrumbs ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Show Icons</h5>
                <p className="text-sm text-gray-600">Display icons alongside text</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={appearanceSettings.showIcons}
                  onChange={(e) => handleAppearanceChange('showIcons', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  appearanceSettings.showIcons ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Language & Region</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Language Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Language</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="language" 
                value="en" 
                checked={languageSettings.language === 'en'}
                onChange={(e) => handleLanguageChange('language', e.target.value)}
                className="text-blue-600" 
              />
              <div>
                <span className="font-medium text-gray-900">English</span>
                <p className="text-sm text-gray-600">English (India)</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="language" 
                value="hi" 
                checked={languageSettings.language === 'hi'}
                onChange={(e) => handleLanguageChange('language', e.target.value)}
                className="text-blue-600" 
              />
              <div>
                <span className="font-medium text-gray-900">हिंदी</span>
                <p className="text-sm text-gray-600">Hindi (India)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Time Zone Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Time Zone</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="timezone" 
                value="IST" 
                defaultChecked
                className="text-blue-600" 
              />
              <div>
                <span className="font-medium text-gray-900">IST (UTC+5:30)</span>
                <p className="text-sm text-gray-600">Indian Standard Time</p>
              </div>
            </label>
          </div>
        </div>

        {/* Date Format */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Date Format</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="dateFormat" 
                value="dd/mm/yyyy" 
                defaultChecked
                className="text-blue-600" 
              />
              <div>
                <span className="font-medium text-gray-900">DD/MM/YYYY</span>
                <p className="text-sm text-gray-600">15/01/2024</p>
              </div>
            </label>
          </div>
        </div>

        {/* Currency Format */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Currency Format</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="currency" 
                value="INR" 
                defaultChecked
                className="text-blue-600" 
              />
              <div>
                <span className="font-medium text-gray-900">Indian Rupee (₹)</span>
                <p className="text-sm text-gray-600">₹2,499.00</p>
              </div>
            </label>
          </div>
        </div>

        {/* Number Format */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Number Format</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="numberFormat" 
                value="indian" 
                defaultChecked
                className="text-blue-600" 
              />
              <div>
                <span className="font-medium text-gray-900">Indian System</span>
                <p className="text-sm text-gray-600">1,00,000 (Lakhs and Crores)</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate New Key
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Production API Key</h4>
              <p className="text-sm text-gray-600">sk_live_...abc123</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-700 text-sm">Copy</button>
              <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Test API Key</h4>
              <p className="text-sm text-gray-600">sk_test_...xyz789</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-700 text-sm">Copy</button>
              <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSection();
      case 'company':
        return renderCompanySection();
      case 'subscription':
        return renderSubscriptionSection();
      case 'payment':
        return renderPaymentSection();
      case 'signatures':
        return renderSignaturesSection();
      case 'security':
        return renderSecuritySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'language':
        return renderLanguageSection();
      case 'api':
        return renderApiSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 