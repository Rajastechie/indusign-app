import React, { useState, useRef } from 'react';
import { Table, Folder, CheckCircle, Clock, Edit, AlertCircle } from 'lucide-react';
import AdvancedSearch from '../components/search/AdvancedSearch';
import DocumentTable from '../components/documents/DocumentTable';
import BulkOperationsPanel from '../components/bulk/BulkOperationsPanel';
import BulkOperationsHistory from '../components/bulk/BulkOperationsHistory';
import BulkOperationModal from '../components/bulk/BulkOperationModal';
import SearchResults from '../components/search/SearchResults';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { useBulkOperations } from '../hooks/useBulkOperations';
import { documentActions, statusUtils } from '../utils/documentActions';

const DocRepoModular = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState('table');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState({ subject: '', body: '' });
  const [copyStatus, setCopyStatus] = useState({ subject: false, body: false, all: false });
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppPhone, setWhatsAppPhone] = useState('');
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [pendingBulkOperation, setPendingBulkOperation] = useState(null);

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
      name: 'Proposal_2024.pdf',
      status: 'pending',
      dateCreated: '2024-01-11',
      dateSigned: null,
      fileSize: '4.1 MB',
      pages: 12,
      signer: 'David Brown',
      description: 'Project proposal document',
      tags: ['proposal', 'project', 'business'],
      folder: 'Proposals'
    }
  ]);

  // Use the advanced search hook
  const searchHook = useAdvancedSearch(documents);
  
  // Use the bulk operations hook
  const bulkOperations = useBulkOperations();

  // Document selection handlers
  const handleSelectDocument = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === searchHook.currentDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(searchHook.currentDocuments.map(doc => doc.id));
    }
  };

  // Document action handlers
  const handleDownload = (document) => {
    documentActions.download(document);
  };

  const handleView = (document) => {
    documentActions.view(document, onNavigate);
  };

  const handleEdit = (document) => {
    documentActions.edit(document, onNavigate);
  };

  const handleDelete = (document) => {
    documentActions.delete(document);
  };

  const handleComments = (document) => {
    onNavigate('comments', { document });
  };

  // Enhanced bulk action handlers
  const handleBulkOperation = (operationType) => {
    const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
    setPendingBulkOperation({ type: operationType, documents: selectedDocs });
    setShowBulkModal(true);
  };

  const handleBulkConfirm = async (options) => {
    const { type, documents: selectedDocs } = pendingBulkOperation;
    
    try {
      switch (type) {
        case 'download':
          await bulkOperations.bulkDownload(selectedDocs, options);
          break;
        case 'delete':
          await bulkOperations.bulkDelete(selectedDocs, options);
          break;
        case 'email':
          await bulkOperations.bulkEmail(selectedDocs, options);
          break;
        case 'whatsapp':
          await bulkOperations.bulkWhatsApp(selectedDocs, options);
          break;
      }
      
      setSelectedDocuments([]);
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };

  const handleRetryOperation = (operation) => {
    // Implement retry logic for failed operations
    console.log('Retrying operation:', operation);
  };

  const handleWhatsAppSend = async () => {
    if (!whatsAppPhone.trim()) {
      alert('Please enter a valid phone number');
      return;
    }

    const cleanPhone = whatsAppPhone.replace(/\D/g, '');
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(whatsAppMessage)}`;
    const whatsappWebUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppMessage)}`;

    try {
      if (window.electronAPI) {
        await window.electronAPI.openExternal(whatsappUrl);
      } else {
        window.open(whatsappUrl);
      }
    } catch (error) {
      try {
        if (window.electronAPI) {
          await window.electronAPI.openExternal(whatsappWebUrl);
        } else {
          window.open(whatsappWebUrl);
        }
      } catch (fallbackError) {
        window.open(whatsappWebUrl);
      }
    }

    setShowWhatsAppModal(false);
    setSelectedDocuments([]);
  };

  // Copy to clipboard utility
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 1500);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
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

  // Status utilities
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
    const badge = statusUtils.getBadge(status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Document Repository</h1>
          </div>
        </div>
        
        {/* Enhanced Bulk Operations Panel */}
        <BulkOperationsPanel
          selectedDocuments={selectedDocuments}
          onBulkDownload={() => handleBulkOperation('download')}
          onBulkDelete={() => handleBulkOperation('delete')}
          onBulkEmail={() => handleBulkOperation('email')}
          onBulkWhatsApp={() => handleBulkOperation('whatsapp')}
          onClearSelection={() => setSelectedDocuments([])}
          onSelectAll={handleSelectAll}
          documents={documents}
          isProcessing={bulkOperations.isProcessing}
          processingProgress={bulkOperations.processingProgress}
          onCancelOperation={bulkOperations.cancelOperation}
        />

        {/* Advanced Search */}
        <AdvancedSearch
          searchTerm={searchHook.searchTerm}
          onSearchChange={searchHook.setSearchTerm}
          onSaveSearch={searchHook.saveCurrentSearch}
          onClearFilters={searchHook.clearAllFilters}
          searchHistory={searchHook.searchHistory}
          savedSearches={searchHook.savedSearches}
          onLoadSavedSearch={searchHook.loadSavedSearch}
          advancedFilters={searchHook.advancedFilters}
          onAdvancedFiltersChange={searchHook.setAdvancedFilters}
          statusFilter={searchHook.statusFilter}
          onStatusFilterChange={searchHook.setStatusFilter}
          folderFilter={searchHook.folderFilter}
          onFolderFilterChange={searchHook.setFolderFilter}
          folders={searchHook.folders}
        />

        {/* Search Results Summary */}
        <SearchResults
          filteredCount={searchHook.filteredDocuments.length}
          totalCount={documents.length}
          searchTerm={searchHook.searchTerm}
          currentPage={searchHook.currentPage}
          totalPages={searchHook.totalPages}
        />

        {/* View Mode Toggle */}
        <div className="mb-4 flex justify-end">
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

        {/* Documents View */}
        {viewMode === 'table' ? (
          <DocumentTable
            documents={searchHook.currentDocuments}
            selectedDocuments={selectedDocuments}
            onSelectDocument={handleSelectDocument}
            onSelectAll={handleSelectAll}
            onSort={searchHook.handleSort}
            sortBy={searchHook.sortBy}
            sortOrder={searchHook.sortOrder}
            onDownload={handleDownload}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComments={handleComments}
            currentPage={searchHook.currentPage}
            totalPages={searchHook.totalPages}
            onPageChange={searchHook.handlePageChange}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Folder view coming soon...</p>
          </div>
        )}

        {/* Bulk Operations History */}
        <BulkOperationsHistory
          operationHistory={bulkOperations.operationHistory}
          onRetryOperation={handleRetryOperation}
        />
      </div>

      {/* Bulk Operation Confirmation Modal */}
      <BulkOperationModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        operationType={pendingBulkOperation?.type}
        selectedDocuments={pendingBulkOperation?.documents || []}
        onConfirm={handleBulkConfirm}
        onCancel={() => setShowBulkModal(false)}
      />

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
    </>
  );
};

export default DocRepoModular; 