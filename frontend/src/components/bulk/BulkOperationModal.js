import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Mail,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Info,
  Clock,
  Shield
} from 'lucide-react';

const BulkOperationModal = ({
  isOpen,
  onClose,
  operationType,
  selectedDocuments,
  onConfirm,
  onCancel
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [notifyRecipients, setNotifyRecipients] = useState(true);
  const [includeMessage, setIncludeMessage] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  const getOperationDetails = () => {
    switch (operationType) {
      case 'download':
        return {
          icon: Download,
          title: 'Bulk Download',
          description: 'Download all selected documents',
          color: 'text-green-600 bg-green-100',
          warning: 'Large downloads may take time',
          confirmText: 'DOWNLOAD',
          requiresConfirmation: false
        };
      case 'delete':
        return {
          icon: Trash2,
          title: 'Bulk Delete',
          description: 'Permanently delete selected documents',
          color: 'text-red-600 bg-red-100',
          warning: 'This action cannot be undone',
          confirmText: 'DELETE',
          requiresConfirmation: true
        };
      case 'email':
        return {
          icon: Mail,
          title: 'Bulk Email',
          description: 'Share documents via email',
          color: 'text-blue-600 bg-blue-100',
          warning: 'Email client will open for each document',
          confirmText: 'SEND EMAILS',
          requiresConfirmation: false
        };
      case 'whatsapp':
        return {
          icon: MessageCircle,
          title: 'Bulk WhatsApp',
          description: 'Share documents via WhatsApp',
          color: 'text-green-500 bg-green-100',
          warning: 'WhatsApp will open for each document',
          confirmText: 'SEND VIA WHATSAPP',
          requiresConfirmation: false
        };
      default:
        return {
          icon: Info,
          title: 'Bulk Operation',
          description: 'Perform operation on selected documents',
          color: 'text-gray-600 bg-gray-100',
          warning: 'Please review before proceeding',
          confirmText: 'CONFIRM',
          requiresConfirmation: true
        };
    }
  };

  const details = getOperationDetails();
  const Icon = details.icon;

  const handleConfirm = () => {
    if (details.requiresConfirmation && confirmText !== details.confirmText) {
      return;
    }

    const options = {
      notifyRecipients,
      includeMessage,
      customMessage: customMessage.trim()
    };

    onConfirm(options);
    onClose();
  };

  const getTotalSize = () => {
    return selectedDocuments.reduce((total, doc) => {
      const size = parseFloat(doc.fileSize) || 0;
      return total + size;
    }, 0);
  };

  const getEstimatedTime = () => {
    const totalSize = getTotalSize();
    const avgSpeed = 2; // MB per second
    const estimatedSeconds = Math.ceil(totalSize / avgSpeed);
    
    if (estimatedSeconds < 60) return `${estimatedSeconds} seconds`;
    if (estimatedSeconds < 3600) return `${Math.ceil(estimatedSeconds / 60)} minutes`;
    return `${Math.ceil(estimatedSeconds / 3600)} hours`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${details.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{details.title}</h3>
              <p className="text-sm text-gray-600">{details.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">{details.warning}</p>
              </div>
            </div>
          </div>

          {/* Operation Summary */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Operation Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Documents Selected</span>
                <span className="text-sm font-medium text-gray-900">{selectedDocuments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Size</span>
                <span className="text-sm font-medium text-gray-900">{getTotalSize().toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Time</span>
                <span className="text-sm font-medium text-gray-900">{getEstimatedTime()}</span>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Documents</h4>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {selectedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-900">{doc.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{doc.fileSize}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          {(operationType === 'email' || operationType === 'whatsapp') && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Sharing Options</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifyRecipients"
                    checked={notifyRecipients}
                    onChange={(e) => setNotifyRecipients(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyRecipients" className="text-sm text-gray-700">
                    Notify recipients
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeMessage"
                    checked={includeMessage}
                    onChange={(e) => setIncludeMessage(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeMessage" className="text-sm text-gray-700">
                    Include custom message
                  </label>
                </div>
                {includeMessage && (
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter your custom message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* Confirmation */}
          {details.requiresConfirmation && (
            <div className="mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Confirmation Required</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Type <strong>{details.confirmText}</strong> to confirm this action
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Type "${details.confirmText}" to confirm`}
                  className="mt-3 w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={details.requiresConfirmation && confirmText !== details.confirmText}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                details.requiresConfirmation && confirmText !== details.confirmText
                  ? 'bg-gray-400 cursor-not-allowed'
                  : operationType === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {details.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationModal; 