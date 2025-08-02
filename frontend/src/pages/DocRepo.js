import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  HardDrive,
  SortAsc,
  SortDesc,
  ArrowLeft,
  Folder,
  FolderOpen,
  Grid,
  List,
  Table
} from 'lucide-react';

const DocRepo = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'folders'
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Track selected documents
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' }); // Date range filter
  const [showDatePicker, setShowDatePicker] = useState(false); // Show/hide date picker
  const [showEmailModal, setShowEmailModal] = useState(false); // Show/hide email modal
  const [emailContent, setEmailContent] = useState({ subject: '', body: '' }); // Email content for modal
  const [copyStatus, setCopyStatus] = useState({ subject: false, body: false, all: false }); // Copy button status
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false); // Show/hide WhatsApp modal
  const [whatsAppPhone, setWhatsAppPhone] = useState(''); // WhatsApp phone number
  const [whatsAppMessage, setWhatsAppMessage] = useState(''); // WhatsApp message content
  const dateFilterRef = useRef(null); // Ref for date filter button
  
  // Advanced search and filtering states
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false); // Show/hide advanced search
  const [searchHistory, setSearchHistory] = useState([]); // Search history
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false); // Show search suggestions
  const [advancedFilters, setAdvancedFilters] = useState({
    fileSize: { min: '', max: '' },
    documentType: 'all',
    signerFilter: '',
    dateRange: { start: '', end: '' },
    tags: []
  }); // Advanced filters
  const [savedSearches, setSavedSearches] = useState([]); // Saved search queries
  const [showSavedSearches, setShowSavedSearches] = useState(false); // Show saved searches

  // Mock data - replace with real data from your backend
  const [documents] = useState([
    {
      id: 1,
      name: 'Contract_2024.pdf',
      status: 'signed',
      dateCreated: '2024-01-15',
      dateSigned: '2024-01-15',
      fileSize: '2.4 MB',
      pages: 5,
      signer: 'John Doe',
      description: 'Annual service contract agreement',
      tags: ['contract', 'legal', 'annual'],
      folder: 'Contracts'
    },
    {
      id: 2,
      name: 'Invoice_001.pdf',
      status: 'pending',
      dateCreated: '2024-01-14',
      dateSigned: null,
      fileSize: '1.8 MB',
      pages: 3,
      signer: 'Jane Smith',
      description: 'Monthly invoice for services',
      tags: ['invoice', 'monthly', 'finance'],
      folder: 'Invoices'
    },
    {
      id: 3,
      name: 'Agreement.pdf',
      status: 'signed',
      dateCreated: '2024-01-13',
      dateSigned: '2024-01-13',
      fileSize: '3.2 MB',
      pages: 8,
      signer: 'Mike Johnson',
      description: 'Partnership agreement document',
      tags: ['agreement', 'partnership', 'legal'],
      folder: 'Partnerships'
    },
    {
      id: 4,
      name: 'NDA_Confidential.pdf',
      status: 'draft',
      dateCreated: '2024-01-12',
      dateSigned: null,
      fileSize: '1.5 MB',
      pages: 4,
      signer: 'Sarah Wilson',
      description: 'Non-disclosure agreement',
      tags: ['nda', 'confidential', 'legal'],
      folder: 'Legal'
    },
    {
      id: 5,
      name: 'Employment_Contract.pdf',
      status: 'signed',
      dateCreated: '2024-01-10',
      dateSigned: '2024-01-11',
      fileSize: '4.1 MB',
      pages: 12,
      signer: 'Alex Brown',
      description: 'Employment contract for new hire',
      tags: ['employment', 'contract', 'hr'],
      folder: 'HR'
    },
    {
      id: 6,
      name: 'Service_Agreement.pdf',
      status: 'signed',
      dateCreated: '2024-01-09',
      dateSigned: '2024-01-09',
      fileSize: '2.1 MB',
      pages: 6,
      signer: 'David Lee',
      description: 'Service agreement with vendor',
      tags: ['service', 'vendor', 'agreement'],
      folder: 'Contracts'
    },
    {
      id: 7,
      name: 'Invoice_002.pdf',
      status: 'pending',
      dateCreated: '2024-01-08',
      dateSigned: null,
      fileSize: '1.2 MB',
      pages: 2,
      signer: 'Lisa Chen',
      description: 'Consulting services invoice',
      tags: ['invoice', 'consulting', 'finance'],
      folder: 'Invoices'
    },
    {
      id: 8,
      name: 'Privacy_Policy.pdf',
      status: 'signed',
      dateCreated: '2024-01-07',
      dateSigned: '2024-01-07',
      fileSize: '3.5 MB',
      pages: 10,
      signer: 'Mark Wilson',
      description: 'Updated privacy policy document',
      tags: ['privacy', 'policy', 'legal'],
      folder: 'Legal'
    }
  ]);

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Advanced search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.signer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.folder.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Folder filter
    if (folderFilter !== 'all') {
      filtered = filtered.filter(doc => doc.folder === folderFilter);
    }

    // Advanced filters
    if (advancedFilters.signerFilter) {
      filtered = filtered.filter(doc => 
        doc.signer.toLowerCase().includes(advancedFilters.signerFilter.toLowerCase())
      );
    }

    if (advancedFilters.documentType !== 'all') {
      filtered = filtered.filter(doc => {
        const docType = doc.name.split('.').pop().toLowerCase();
        return docType === advancedFilters.documentType;
      });
    }

    if (advancedFilters.fileSize.min || advancedFilters.fileSize.max) {
      filtered = filtered.filter(doc => {
        const size = parseFloat(doc.fileSize);
        const minSize = advancedFilters.fileSize.min ? parseFloat(advancedFilters.fileSize.min) : 0;
        const maxSize = advancedFilters.fileSize.max ? parseFloat(advancedFilters.fileSize.max) : Infinity;
        return size >= minSize && size <= maxSize;
      });
    }

    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(doc => 
        advancedFilters.tags.some(tag => doc.tags.includes(tag))
      );
    }

    // Date filter (enhanced)
    if (dateFilter.start || dateFilter.end || advancedFilters.dateRange.start || advancedFilters.dateRange.end) {
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.dateCreated);
        const startDate = dateFilter.start || advancedFilters.dateRange.start ? 
          new Date(dateFilter.start || advancedFilters.dateRange.start) : null;
        const endDate = dateFilter.end || advancedFilters.dateRange.end ? 
          new Date(dateFilter.end || advancedFilters.dateRange.end) : null;
        
        if (startDate && endDate) {
          return docDate >= startDate && docDate <= endDate;
        } else if (startDate) {
          return docDate >= startDate;
        } else if (endDate) {
          return docDate <= endDate;
        }
        return true;
      });
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
          break;
        case 'size':
          aValue = parseFloat(a.fileSize);
          bValue = parseFloat(b.fileSize);
          break;
        case 'signer':
          aValue = a.signer.toLowerCase();
          bValue = b.signer.toLowerCase();
          break;
        default:
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [documents, searchTerm, statusFilter, folderFilter, dateFilter, advancedFilters, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium";
    switch (status) {
      case 'signed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'draft':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDownload = (document) => {
    console.log('Downloading:', document.name);
    // Create a mock download link
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${btoa('Mock PDF content')}`;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Downloading ${document.name}`);
  };

  const handleView = (document) => {
    console.log('Viewing:', document.name);
    // Open document in new tab (mock implementation)
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head><title>${document.name}</title></head>
        <body>
          <h1>${document.name}</h1>
          <p>This is a preview of ${document.name}</p>
          <p>Status: ${document.status}</p>
          <p>Signer: ${document.signer}</p>
          <p>Pages: ${document.pages}</p>
          <p>Size: ${document.fileSize}</p>
        </body>
      </html>
    `);
  };

  const handleEdit = (document) => {
    console.log('Editing:', document.name);
    // Navigate to PDF viewer with this document
    alert(`Opening ${document.name} for editing`);
    // You can implement navigation to PDF viewer here
    // window.location.href = `/edit/${document.id}`;
  };

  const handleDelete = (document) => {
    console.log('Deleting:', document.name);
    const confirmed = window.confirm(`Are you sure you want to delete "${document.name}"? This action cannot be undone.`);
    if (confirmed) {
      // Remove document from the list (mock implementation)
      alert(`Deleted ${document.name}`);
      // In real implementation, you would call an API to delete the document
    }
  };

  // Checkbox functions
  const handleSelectDocument = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === currentDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentDocuments.map(doc => doc.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to delete.');
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedDocuments.length} selected document(s)? This action cannot be undone.`);
    if (confirmed) {
      alert(`Deleted ${selectedDocuments.length} document(s)`);
      setSelectedDocuments([]);
      // In real implementation, you would call an API to delete the documents
    }
  };

  const handleBulkDownload = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to download.');
      return;
    }
    
    alert(`Downloading ${selectedDocuments.length} document(s)`);
    // In real implementation, you would call an API to download the documents
  };

  const handleBulkEmail = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to email.');
      return;
    }

    // Get selected documents
    const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
    
    // Generate document links (in real implementation, these would be actual shareable links)
    const documentLinks = selectedDocs.map(doc => {
      const baseUrl = window.location.origin;
      const signLink = `${baseUrl}/sign/${doc.id}`;
      const viewLink = `${baseUrl}/view/${doc.id}`;
      
      return {
        name: doc.name,
        signLink: signLink,
        viewLink: viewLink,
        status: doc.status
      };
    });

    // Create email content
    const subject = `Document(s) for Signature - InduSign`;
    
    const body = `Hello,

I'm sharing ${selectedDocuments.length} document(s) with you for signature through InduSign.

Documents:
${documentLinks.map(doc => `• ${doc.name} (${doc.status})`).join('\n')}

Signing Links:
${documentLinks.map(doc => `• ${doc.name}: ${doc.signLink}`).join('\n')}

View Links:
${documentLinks.map(doc => `• ${doc.name}: ${doc.viewLink}`).join('\n')}

Please click on the signing links above to review and sign the documents electronically.

Best regards,
[Your Name]`;

    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    let emailClientOpened = false;
    
        if (window.electronAPI) {
      // Electron environment - use shell.openExternal
      console.log('Electron API available, calling openExternal with:', mailtoLink);
      window.electronAPI.openExternal(mailtoLink).then(result => {
        console.log('openExternal result:', result);
        if (result.success) {
          emailClientOpened = true;
          setSelectedDocuments([]);
        } else {
          // Fallback: show email content in modal
          displayEmailModal(subject, body, documentLinks);
        }
      }).catch(error => {
        console.error('Error calling openExternal:', error);
        // Fallback: show email content in modal
        displayEmailModal(subject, body, documentLinks);
      });
    } else {
      // Web environment - try to trigger email client
      try {
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        emailClientOpened = true;
        setSelectedDocuments([]);
              } catch (error) {
          // Fallback: show email content in modal
          displayEmailModal(subject, body, documentLinks);
        }
    }
  };

  const displayEmailModal = (subject, body, documentLinks) => {
    // Set the email content and show modal
    setEmailContent({ subject, body });
    setShowEmailModal(true);
    setCopyStatus({ subject: false, body: false, all: false });
    
    // Clear selection after showing modal
    setSelectedDocuments([]);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 1500);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 1500);
    }
  };

  // Advanced search functions
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    // Add to search history if not empty
    if (value.trim() && !searchHistory.includes(value.trim())) {
      setSearchHistory(prev => [value.trim(), ...prev.slice(0, 9)]); // Keep last 10 searches
    }
    
    // Show suggestions if typing
    setShowSearchSuggestions(value.length > 0);
  };

  const handleSearchSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSearchSuggestions(false);
  };

  const saveCurrentSearch = () => {
    const searchQuery = {
      name: `Search: ${searchTerm}`,
      query: searchTerm,
      filters: {
        status: statusFilter,
        folder: folderFilter,
        dateRange: dateFilter,
        advanced: advancedFilters
      },
      timestamp: new Date().toISOString()
    };
    
    setSavedSearches(prev => [searchQuery, ...prev.slice(0, 9)]); // Keep last 10 saved searches
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchTerm(savedSearch.query);
    setStatusFilter(savedSearch.filters.status);
    setFolderFilter(savedSearch.filters.folder);
    setDateFilter(savedSearch.filters.dateRange);
    setAdvancedFilters(savedSearch.filters.advanced);
    setShowSavedSearches(false);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFolderFilter('all');
    setDateFilter({ start: '', end: '' });
    setAdvancedFilters({
      fileSize: { min: '', max: '' },
      documentType: 'all',
      signerFilter: '',
      dateRange: { start: '', end: '' },
      tags: []
    });
  };

  const getSearchSuggestions = () => {
    const suggestions = [];
    
    // Add search history
    suggestions.push(...searchHistory.map(item => ({ type: 'history', text: item })));
    
    // Add document names
    documents.forEach(doc => {
      if (doc.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'document', text: doc.name });
      }
    });
    
    // Add signers
    documents.forEach(doc => {
      if (doc.signer.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'signer', text: doc.signer });
      }
    });
    
    // Add tags
    documents.forEach(doc => {
      doc.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.push({ type: 'tag', text: tag });
        }
      });
    });
    
    // Remove duplicates and limit to 10
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.text === suggestion.text)
    ).slice(0, 10);
    
    return uniqueSuggestions;
  };

  const handleBulkWhatsApp = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to share via WhatsApp.');
      return;
    }

    // Get selected documents
    const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
    
    // Generate document links
    const documentLinks = selectedDocs.map(doc => {
      const baseUrl = window.location.origin;
      const signLink = `${baseUrl}/sign/${doc.id}`;
      const viewLink = `${baseUrl}/view/${doc.id}`;
      
      return {
        name: doc.name,
        signLink: signLink,
        viewLink: viewLink,
        status: doc.status
      };
    });

    // Create WhatsApp message
    const message = `Hello! 👋

I'm sharing ${selectedDocuments.length} document(s) with you for signature through InduSign.

📄 Documents:
${documentLinks.map(doc => `• ${doc.name} (${doc.status})`).join('\n')}

✍️ Signing Links:
${documentLinks.map(doc => `• ${doc.name}: ${doc.signLink}`).join('\n')}

👁️ View Links:
${documentLinks.map(doc => `• ${doc.name}: ${doc.viewLink}`).join('\n')}

Please click on the signing links above to review and sign the documents electronically.

Best regards,
[Your Name]`;

    // Set the message and show modal
    setWhatsAppMessage(message);
    setWhatsAppPhone('');
    setShowWhatsAppModal(true);
  };

  const handleWhatsAppSend = async () => {
    if (!whatsAppPhone.trim()) {
      alert('Please enter a valid phone number.');
      return;
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = whatsAppPhone.replace(/[\s\-\(\)]/g, '');
    
    // Create WhatsApp URL - use WhatsApp protocol for desktop app
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(whatsAppMessage)}`;
    
    // Open WhatsApp - try desktop app first, then web
    const whatsappWebUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppMessage)}`;
    
    try {
      if (window.electronAPI) {
        // Electron environment - try desktop app first
        try {
          await window.electronAPI.openExternal(whatsappUrl);
        } catch (error) {
          console.error('Error opening WhatsApp desktop app:', error);
          // Fallback to WhatsApp Web
          try {
            await window.electronAPI.openExternal(whatsappWebUrl);
          } catch (webError) {
            console.error('Error opening WhatsApp Web:', webError);
            // Final fallback to browser
            window.open(whatsappWebUrl, '_blank');
          }
        }
      } else {
        // Web environment - try desktop app first
        try {
          window.open(whatsappUrl, '_blank');
        } catch (error) {
          console.error('Error opening WhatsApp desktop app:', error);
          // Fallback to WhatsApp Web
          window.open(whatsappWebUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Error in WhatsApp sharing:', error);
    }
    
    // Always close modal and clear selection
    setShowWhatsAppModal(false);
    setSelectedDocuments([]);
    
    console.log('WhatsApp sharing completed, staying on Document Repository page');
  };

  // Date filter functions
  const handleDateFilterChange = (type, value) => {
    setDateFilter(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearDateFilter = () => {
    setDateFilter({ start: '', end: '' });
  };

  const applyDateFilter = () => {
    setShowDatePicker(false);
    // The filtering will be handled in the filteredDocuments useMemo
  };

  // Close date picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Get unique folders
  const folders = useMemo(() => {
    const uniqueFolders = [...new Set(documents.map(doc => doc.folder))];
    return uniqueFolders.sort();
  }, [documents]);

  // Group documents by folder
  const documentsByFolder = useMemo(() => {
    const grouped = {};
    filteredDocuments.forEach(doc => {
      if (!grouped[doc.folder]) {
        grouped[doc.folder] = [];
      }
      grouped[doc.folder].push(doc);
    });
    return grouped;
  }, [filteredDocuments]);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Document Repository</h1>
          </div>
          
          {/* Bulk Actions */}
          {selectedDocuments.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedDocuments.length} document(s) selected
              </span>
              <button
                onClick={handleBulkDownload}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
              <button
                onClick={handleBulkEmail}
                className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </button>
              <button
                onClick={handleBulkWhatsApp}
                className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
          )}
        </div>

        {/* Advanced Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar with Advanced Features */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Enhanced Search */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents, descriptions, signers, tags..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
                    className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Advanced Search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowSavedSearches(!showSavedSearches)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Saved Searches"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Search Suggestions */}
                {showSearchSuggestions && searchTerm.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getSearchSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSuggestion(suggestion.text)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          suggestion.type === 'history' ? 'bg-blue-500' :
                          suggestion.type === 'document' ? 'bg-green-500' :
                          suggestion.type === 'signer' ? 'bg-purple-500' : 'bg-orange-500'
                        }`}></span>
                        <span className="text-sm">{suggestion.text}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {suggestion.type === 'history' ? 'Recent' :
                           suggestion.type === 'document' ? 'Document' :
                           suggestion.type === 'signer' ? 'Signer' : 'Tag'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveCurrentSearch}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Search
                </button>
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Basic Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Status Filter */}
              <div className="lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="signed">Signed</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Folder Filter */}
              <div className="lg:w-48">
                <select
                  value={folderFilter}
                  onChange={(e) => setFolderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Folders</option>
                  {folders.map((folder) => (
                    <option key={folder} value={folder}>{folder}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Table View"
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('folders')}
                  className={`p-2 rounded-lg ${viewMode === 'folders' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Folder View"
                >
                  <Folder className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedSearch && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Signer Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Signer</label>
                    <input
                      type="text"
                      placeholder="Filter by signer..."
                      value={advancedFilters.signerFilter}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, signerFilter: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Document Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select
                      value={advancedFilters.documentType}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, documentType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="pdf">PDF</option>
                      <option value="doc">DOC</option>
                      <option value="docx">DOCX</option>
                    </select>
                  </div>

                  {/* File Size Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Size (MB)</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={advancedFilters.fileSize.min}
                        onChange={(e) => setAdvancedFilters(prev => ({ 
                          ...prev, 
                          fileSize: { ...prev.fileSize, min: e.target.value }
                        }))}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={advancedFilters.fileSize.max}
                        onChange={(e) => setAdvancedFilters(prev => ({ 
                          ...prev, 
                          fileSize: { ...prev.fileSize, max: e.target.value }
                        }))}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={advancedFilters.dateRange.start}
                        onChange={(e) => setAdvancedFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={advancedFilters.dateRange.end}
                        onChange={(e) => setAdvancedFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Searches Dropdown */}
          {showSavedSearches && (
            <div className="absolute z-50 w-80 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Saved Searches</h3>
              </div>
              {savedSearches.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No saved searches yet
                </div>
              ) : (
                savedSearches.map((savedSearch, index) => (
                  <button
                    key={index}
                    onClick={() => loadSavedSearch(savedSearch)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-sm">{savedSearch.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(savedSearch.timestamp).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Search Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
            {searchTerm && (
              <span className="ml-2">
                for "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {filteredDocuments.length > 0 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Documents View */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === currentDocuments.length && currentDocuments.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Document</span>
                        {sortBy === 'name' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Status</span>
                        {sortBy === 'status' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('signer')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Signer</span>
                        {sortBy === 'signer' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleSort('date')}
                          className={`flex items-center space-x-1 hover:text-gray-700 ${dateFilter.start || dateFilter.end ? 'text-blue-600' : ''}`}
                        >
                          <span>Date</span>
                          {sortBy === 'date' && (
                            sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          ref={dateFilterRef}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowDatePicker(!showDatePicker);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Filter by date"
                        >
                                                  <svg className={`w-3 h-3 ${dateFilter.start || dateFilter.end ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                        {(dateFilter.start || dateFilter.end) && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('size')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Size</span>
                        {sortBy === 'size' && (
                          sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <span className={getStatusBadge(doc.status)}>
                            {doc.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{doc.signer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {new Date(doc.dateCreated).toLocaleDateString()}
                          </div>
                          {doc.dateSigned && (
                            <div className="text-xs text-gray-500 mt-1">
                              Signed: {new Date(doc.dateSigned).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HardDrive className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{doc.fileSize}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{doc.pages} pages</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(doc)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {currentDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters.'
                    : 'Upload your first document to get started.'
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Folder View */
          <div className="space-y-6">
            {Object.keys(documentsByFolder).length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find documents.</p>
              </div>
            ) : (
              Object.entries(documentsByFolder).map(([folderName, docs]) => (
                <div key={folderName} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-medium text-gray-900">{folderName}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {docs.length} {docs.length === 1 ? 'document' : 'documents'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {docs.map((doc) => (
                      <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(doc.status)}
                                  <span className={getStatusBadge(doc.status)}>
                                    {doc.status}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {doc.signer}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {doc.dateCreated}
                                </span>
                                <span className="flex items-center">
                                  <HardDrive className="w-3 h-3 mr-1" />
                                  {doc.fileSize}
                                </span>
                                <span>{doc.pages} pages</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(doc)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(doc)}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length} documents
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Total: {filteredDocuments.length} documents
        </div>
      </div>

      {/* Portal-based Date Picker */}
      {showDatePicker && dateFilterRef.current && (
        <div 
          className="date-picker-container fixed bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 min-w-80"
          style={{
            top: dateFilterRef.current.getBoundingClientRect().bottom + 5,
            left: dateFilterRef.current.getBoundingClientRect().left,
            zIndex: 9999
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => handleDateFilterChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => handleDateFilterChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={applyDateFilter}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Apply
              </button>
              <button
                onClick={clearDateFilter}
                className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
              )}

        {/* WhatsApp Modal */}
        {showWhatsAppModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share via WhatsApp</h3>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number (with country code):
                  </label>
                  <input
                    type="tel"
                    value={whatsAppPhone}
                    onChange={(e) => setWhatsAppPhone(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: +91XXXXXXXXXX, +1XXXXXXXXXX
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Preview:</label>
                  <textarea
                    value={whatsAppMessage}
                    readOnly
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWhatsAppSend}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Email Client Not Found</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Your default email client couldn't be opened. Please copy the email content below:
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                  <input
                    type="text"
                    value={emailContent.subject}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body:</label>
                  <textarea
                    value={emailContent.body}
                    readOnly
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => copyToClipboard(emailContent.body, 'all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    copyStatus.all 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copyStatus.all ? 'Copied!' : 'Copy Content'}
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default DocRepo; 