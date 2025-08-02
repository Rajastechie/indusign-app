import React, { useState } from 'react';
import { Upload, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

const UploadPage = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  const handleContinueToSignature = () => {
    // Pass the uploaded file to the signature page
    onNavigate('signature', { uploadedFile: selectedFile });
  };

  const handleDone = () => {
    onNavigate('dashboard');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please drop a valid PDF file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/images/is-bg-white.logo.png" 
              alt="InduSign Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-3xl font-bold text-gray-900">Upload PDF Document</h1>
          </div>
          <p className="text-gray-600">Select a PDF file to start the signing process</p>
        </div>

        {!uploadSuccess ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                selectedFile
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              {selectedFile ? (
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-medium text-gray-900">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isUploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload & Continue'}
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop your PDF here, or click to browse
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Supports PDF files up to 10MB
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      Choose File
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Select a PDF document you want to sign</li>
                <li>• File should be less than 10MB</li>
                <li>• After upload, you'll be taken to the signature page</li>
                <li>• You can then draw or upload your signature</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
            <p className="text-gray-600 mb-6">Your document has been uploaded successfully.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDone}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleContinueToSignature}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Signature
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Choose "Done" to return to dashboard or "Continue to Signature" to sign the document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage; 