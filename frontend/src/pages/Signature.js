import React, { useState } from 'react';
import { PenTool, ArrowLeft, CheckCircle, Plus, FileText } from 'lucide-react';

const Signature = ({ onNavigate, uploadedFile }) => {
  const [selectedSignature, setSelectedSignature] = useState(null);
  
  // Mock saved signatures - in real app, these would come from backend/database
  const [savedSignatures] = useState([
    {
      id: 1,
      name: 'John Doe',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: '2024-01-15',
      isDefault: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: '2024-01-10',
      isDefault: false
    },
    {
      id: 3,
      name: 'Mike Johnson',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdAt: '2024-01-05',
      isDefault: false
    }
  ]);

  const handleSignatureSelect = (signature) => {
    setSelectedSignature(signature);
  };

  const handleContinue = () => {
    if (selectedSignature) {
      // Navigate to PDF viewer with selected signature and uploaded file
      onNavigate('pdfviewer', { 
        uploadedFile: uploadedFile,
        selectedSignature: selectedSignature 
      });
    } else {
      alert('Please select a signature first.');
    }
  };

  const handleCreateNew = () => {
    // Navigate to signature creation page
    onNavigate('createsignature');
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
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/images/is-bg-white.logo.png" 
              alt="InduSign Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-3xl font-bold text-gray-900">Select Your Signature</h1>
          </div>
          <p className="text-gray-600">Choose from your saved signatures or create a new one</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Saved Signatures */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Saved Signatures</h3>
              <button
                onClick={handleCreateNew}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </button>
            </div>

            {savedSignatures.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No saved signatures found</p>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Signature
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSignatures.map((sig) => (
                  <div
                    key={sig.id}
                    onClick={() => handleSignatureSelect(sig)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSignature?.id === sig.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{sig.name}</h4>
                      {sig.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="border border-gray-200 rounded p-3 mb-3 bg-white">
                      <img 
                        src={sig.image} 
                        alt={sig.name}
                        className="w-full h-16 object-contain"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {sig.createdAt}</span>
                      {selectedSignature?.id === sig.id && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedSignature}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                selectedSignature
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to PDF Viewer
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Click on a signature to select it for use</li>
            <li>• The selected signature will be highlighted in blue</li>
            <li>• Click "Create New" to add a new signature</li>
            <li>• Once you've selected a signature, click "Continue to PDF Viewer"</li>
            <li>• You'll be able to place your signature on the PDF document</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signature; 