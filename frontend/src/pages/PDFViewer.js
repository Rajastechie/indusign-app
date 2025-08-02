import React, { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';

const PDFViewerPage = ({ onNavigate, uploadedFile, selectedSignature }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const [signaturePlaced, setSignaturePlaced] = useState(false);

  // Set the uploaded file and selected signature
  React.useEffect(() => {
    if (uploadedFile) {
      setPdfFile(uploadedFile);
    }
    if (selectedSignature) {
      setSignature(selectedSignature.image);
    }
  }, [uploadedFile, selectedSignature]);

  const handleSignaturePlacement = (position) => {
    setSignaturePosition(position);
    setSignaturePlaced(true);
  };

  const handleDownload = () => {
    if (signaturePlaced) {
      alert('Signed PDF exported successfully!');
      onNavigate('dashboard');
    } else {
      alert('Please place a signature on the document first.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
          <h1 className="text-xl font-semibold text-gray-900">PDF Viewer</h1>
        </div>
      </div>

      {pdfFile ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <PDFViewer
                file={pdfFile}
                signature={signature}
                onSignaturePlacement={handleSignaturePlacement}
                signaturePosition={signaturePosition}
                onDownload={handleDownload}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  disabled={!signaturePlaced}
                  className={`w-full px-4 py-3 rounded-lg transition-colors ${
                    signaturePlaced
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Signed PDF</span>
                  </div>
                </button>
              </div>

              {/* Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${signaturePlaced ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Signature placed: {signaturePlaced ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Document ready for signing</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use the PDF viewer controls to navigate and zoom</li>
                  <li>• Click on signature areas to place your signature</li>
                  <li>• Use the "Place Signature" button for automatic placement</li>
                  <li>• Export when ready to download signed PDF</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Loaded</h3>
            <p className="text-gray-600 mb-4">
              Please upload a PDF document to view it here.
            </p>
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewerPage; 