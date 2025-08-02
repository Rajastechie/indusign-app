// Language utility for Hindi translations
export const translations = {
  en: {
    // Header
    'dashboard': 'Dashboard',
    'docrepo': 'Document Repository',
    'settings': 'Settings',
    'help': 'Help',
    'logout': 'Logout',
    
    // Dashboard
    'welcome': 'Welcome to InduSign',
    'quickActions': 'Quick Actions',
    'uploadPdf': 'Upload PDF',
    'createSignature': 'Create Signature',
    'recentDocuments': 'Recent Documents',
    'viewAll': 'View All',
    
    // Document Repository
    'documentRepository': 'Document Repository',
    'searchDocuments': 'Search documents, descriptions, signers...',
    'allStatus': 'All Status',
    'allFolders': 'All Folders',
    'tableView': 'Table View',
    'folderView': 'Folder View',
    'document': 'Document',
    'status': 'Status',
    'signer': 'Signer',
    'date': 'Date',
    'size': 'Size',
    'pages': 'Pages',
    'tags': 'Tags',
    'actions': 'Actions',
    'view': 'View',
    'download': 'Download',
    'edit': 'Edit',
    'delete': 'Delete',
    'noDocumentsFound': 'No documents found',
    'uploadFirstDocument': 'Upload your first document to get started',
    
    // Settings
    'personalInformation': 'Personal Information',
    'companyInformation': 'Company Information',
    'subscriptionDetails': 'Subscription Details',
    'paymentMethods': 'Payment Methods',
    'mySignatures': 'My Signatures',
    'securitySettings': 'Security Settings',
    'notificationPreferences': 'Notification Preferences',
    'appearanceSettings': 'Appearance Settings',
    'languageRegion': 'Language & Region',
    'apiKeys': 'API Keys',
    'edit': 'Edit',
    'saveChanges': 'Save Changes',
    'cancel': 'Cancel',
    'resetToDefault': 'Reset to Default',
    
    // Common
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'email': 'Email',
    'phone': 'Phone',
    'companyName': 'Company Name',
    'address': 'Address',
    'city': 'City',
    'state': 'State',
    'zipCode': 'ZIP Code',
    'country': 'Country',
    'website': 'Website',
    'taxId': 'Tax ID',
    
    // Status
    'signed': 'Signed',
    'pending': 'Pending',
    'draft': 'Draft',
    
    // Messages
    'languageChangedToEnglish': 'Language changed to English',
    'languageChangedToHindi': 'भाषा हिंदी में बदल गई है'
  },
  
  hi: {
    // Header
    'dashboard': 'डैशबोर्ड',
    'docrepo': 'दस्तावेज़ भंडार',
    'settings': 'सेटिंग्स',
    'help': 'सहायता',
    'logout': 'लॉगआउट',
    
    // Dashboard
    'welcome': 'इंडूसाइन में आपका स्वागत है',
    'quickActions': 'त्वरित कार्य',
    'uploadPdf': 'PDF अपलोड करें',
    'createSignature': 'हस्ताक्षर बनाएं',
    'recentDocuments': 'हाल के दस्तावेज़',
    'viewAll': 'सभी देखें',
    
    // Document Repository
    'documentRepository': 'दस्तावेज़ भंडार',
    'searchDocuments': 'दस्तावेज़, विवरण, हस्ताक्षरकर्ता खोजें...',
    'allStatus': 'सभी स्थिति',
    'allFolders': 'सभी फ़ोल्डर',
    'tableView': 'तालिका दृश्य',
    'folderView': 'फ़ोल्डर दृश्य',
    'document': 'दस्तावेज़',
    'status': 'स्थिति',
    'signer': 'हस्ताक्षरकर्ता',
    'date': 'तिथि',
    'size': 'आकार',
    'pages': 'पृष्ठ',
    'tags': 'टैग',
    'actions': 'कार्य',
    'view': 'देखें',
    'download': 'डाउनलोड',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'noDocumentsFound': 'कोई दस्तावेज़ नहीं मिला',
    'uploadFirstDocument': 'शुरू करने के लिए अपना पहला दस्तावेज़ अपलोड करें',
    
    // Settings
    'personalInformation': 'व्यक्तिगत जानकारी',
    'companyInformation': 'कंपनी की जानकारी',
    'subscriptionDetails': 'सदस्यता विवरण',
    'paymentMethods': 'भुगतान विधियां',
    'mySignatures': 'मेरे हस्ताक्षर',
    'securitySettings': 'सुरक्षा सेटिंग्स',
    'notificationPreferences': 'सूचना प्राथमिकताएं',
    'appearanceSettings': 'उपस्थिति सेटिंग्स',
    'languageRegion': 'भाषा और क्षेत्र',
    'apiKeys': 'API कुंजी',
    'edit': 'संपादित करें',
    'saveChanges': 'परिवर्तन सहेजें',
    'cancel': 'रद्द करें',
    'resetToDefault': 'डिफ़ॉल्ट पर रीसेट करें',
    
    // Common
    'firstName': 'पहला नाम',
    'lastName': 'अंतिम नाम',
    'email': 'ईमेल',
    'phone': 'फ़ोन',
    'companyName': 'कंपनी का नाम',
    'address': 'पता',
    'city': 'शहर',
    'state': 'राज्य',
    'zipCode': 'पिन कोड',
    'country': 'देश',
    'website': 'वेबसाइट',
    'taxId': 'कर आईडी',
    
    // Status
    'signed': 'हस्ताक्षरित',
    'pending': 'लंबित',
    'draft': 'मसौदा',
    
    // Messages
    'languageChangedToEnglish': 'Language changed to English',
    'languageChangedToHindi': 'भाषा हिंदी में बदल गई है'
  }
};

// Get current language from localStorage
export const getCurrentLanguage = () => {
  return localStorage.getItem('currentLanguage') || 'en';
};

// Get translation for a key
export const t = (key) => {
  const currentLang = getCurrentLanguage();
  return translations[currentLang][key] || translations.en[key] || key;
};

// Switch language
export const switchLanguage = (language) => {
  localStorage.setItem('currentLanguage', language);
  const root = document.documentElement;
  root.classList.remove('lang-en', 'lang-hi');
  root.classList.add(`lang-${language}`);
  
  // Replace text content throughout the application
  replaceTextContent(language);
  
  // Trigger a custom event to notify components
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
  
  // Show success message
  const message = language === 'hi' 
    ? translations.hi.languageChangedToHindi 
    : translations.en.languageChangedToEnglish;
  alert(message);
};

// Replace text content based on language
export const replaceTextContent = (language) => {
  const currentTranslations = translations[language];
  
  // Replace common text elements
  const textElements = document.querySelectorAll('[data-translate]');
  textElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (currentTranslations[key]) {
      element.textContent = currentTranslations[key];
    }
  });
  
  // Replace placeholder text
  const inputElements = document.querySelectorAll('input[data-translate-placeholder]');
  inputElements.forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    if (currentTranslations[key]) {
      element.placeholder = currentTranslations[key];
    }
  });
  
  // Replace button text
  const buttonElements = document.querySelectorAll('button[data-translate]');
  buttonElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (currentTranslations[key]) {
      element.textContent = currentTranslations[key];
    }
  });
};

// Initialize language on app start
export const initializeLanguage = () => {
  const currentLang = getCurrentLanguage();
  const root = document.documentElement;
  root.classList.remove('lang-en', 'lang-hi');
  root.classList.add(`lang-${currentLang}`);
}; 