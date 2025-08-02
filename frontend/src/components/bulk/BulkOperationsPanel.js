import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Mail,
  MessageCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

const BulkOperationsPanel = ({
  selectedDocuments,
  onBulkDownload,
  onBulkDelete,
  onBulkEmail,
  onBulkWhatsApp,
  onClearSelection,
  onSelectAll,
  documents,
  isProcessing,
  processingProgress,
  onCancelOperation
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [operationType, setOperationType] = useState(null);
  const [batchSize, setBatchSize] = useState(10);
  const [autoRetry, setAutoRetry] = useState(true);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);

  const getOperationIcon = (type) => {
    switch (type) {
      case 'download': return Download;
      case 'delete': return Trash2;
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      default: return FileText;
    }
  };

  const getOperationColor = (type) => {
    switch (type) {
      case 'download': return 'text-green-600 bg-green-100';
      case 'delete': return 'text-red-600 bg-red-100';
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'whatsapp': return 'text-green-500 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleBulkOperation = async (type) => {
    setOperationType(type);
    
    try {
      switch (type) {
        case 'download':
          await onBulkDownload(selectedDocuments, { batchSize, autoRetry });
          break;
        case 'delete':
          await onBulkDelete(selectedDocuments, { batchSize, autoRetry });
          break;
        case 'email':
          await onBulkEmail(selectedDocuments, { batchSize, autoRetry });
          break;
        case 'whatsapp':
          await onBulkWhatsApp(selectedDocuments, { batchSize, autoRetry });
          break;
      }
    } catch (error) {
      console.error(`Bulk ${type} operation failed:`, error);
    } finally {
      setOperationType(null);
    }
  };

  const getProgressStatus = () => {
    if (processingProgress.failed > 0) {
      return { icon: AlertCircle, color: 'text-red-600', text: 'Some operations failed' };
    } else if (processingProgress.completed === processingProgress.total) {
      return { icon: CheckCircle, color: 'text-green-600', text: 'All operations completed' };
    } else {
      return { icon: Clock, color: 'text-blue-600', text: 'Processing...' };
    }
  };

  const operations = [
    {
      type: 'download',
      title: 'Download Selected',
      description: 'Download all selected documents',
      icon: Download,
      action: () => handleBulkOperation('download')
    },
    {
      type: 'delete',
      title: 'Delete Selected',
      description: 'Permanently delete selected documents',
      icon: Trash2,
      action: () => handleBulkOperation('delete'),
      confirm: true
    },
    {
      type: 'email',
      title: 'Email Selected',
      description: 'Share documents via email',
      icon: Mail,
      action: () => handleBulkOperation('email')
    },
    {
      type: 'whatsapp',
      title: 'WhatsApp Selected',
      description: 'Share documents via WhatsApp',
      icon: MessageCircle,
      action: () => handleBulkOperation('whatsapp')
    }
  ];

  if (selectedDocuments.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bulk Operations</h3>
            <p className="text-sm text-gray-600">
              {selectedDocuments.length} document(s) selected
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Advanced Options"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClearSelection}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Clear Selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {(() => {
                const status = getProgressStatus();
                return (
                  <>
                    <status.icon className={`w-4 h-4 ${status.color}`} />
                    <span className="text-sm font-medium text-gray-700">{status.text}</span>
                  </>
                );
              })()}
            </div>
            <button
              onClick={onCancelOperation}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Cancel
            </button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(processingProgress.completed / processingProgress.total) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{processingProgress.completed} of {processingProgress.total} completed</span>
            <span>{processingProgress.failed} failed</span>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvancedOptions && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 documents</option>
                <option value={10}>10 documents</option>
                <option value={25}>25 documents</option>
                <option value={50}>50 documents</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRetry"
                checked={autoRetry}
                onChange={(e) => setAutoRetry(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRetry" className="text-sm font-medium text-gray-700">
                Auto-retry failed operations
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifyOnCompletion"
                checked={notifyOnCompletion}
                onChange={(e) => setNotifyOnCompletion(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnCompletion" className="text-sm font-medium text-gray-700">
                Notify on completion
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {operations.map((operation) => {
          const Icon = operation.icon;
          const isActive = operationType === operation.type;
          
          return (
            <button
              key={operation.type}
              onClick={operation.action}
              disabled={isProcessing}
              className={`p-3 border rounded-md text-left transition-all duration-200 ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-md ${getOperationColor(operation.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{operation.title}</h4>
                  <p className="text-xs text-gray-600">{operation.description}</p>
                </div>
                {isActive && (
                  <div className="animate-spin">
                    <RotateCcw className="w-3 h-3 text-blue-600" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {selectedDocuments.length} of {documents.length} documents selected
          </span>
          <button
            onClick={onSelectAll}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedDocuments.length === documents.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsPanel; 