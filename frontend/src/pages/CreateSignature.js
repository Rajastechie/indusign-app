import React, { useState, useRef } from 'react';
import { ArrowLeft, PenTool, Upload, Save, RotateCcw, Download, X } from 'lucide-react';

const CreateSignature = ({ onNavigate }) => {
  const [signature, setSignature] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [signatureType, setSignatureType] = useState('Default');
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'upload'
  const [uploadedFile, setUploadedFile] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const signatureTypes = [
    { id: 'Default', label: 'Default', description: 'Your primary signature' },
    { id: 'Formal', label: 'Formal', description: 'For official documents' },
    { id: 'Initials', label: 'Initials', description: 'Short form signature' },
    { id: 'Digital', label: 'Digital', description: 'Digital certificate style' }
  ];

  const startDrawing = (event) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    setSignature(signatureData);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFile(e.target.result);
          setSignature(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file (PNG, JPG, etc.)');
      }
    }
  };

  const handleSaveSignature = () => {
    if (!signature) {
      alert('Please create or upload a signature first.');
      return;
    }

    if (!signatureName.trim()) {
      alert('Please enter a name for your signature.');
      return;
    }

    // In a real app, this would save to backend/database
    const newSignature = {
      id: Date.now(),
      name: signatureName,
      type: signatureType,
      image: signature,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Mock save - in real app, this would be an API call
    console.log('Saving signature:', newSignature);
    alert(`Signature "${signatureName}" saved successfully!`);
    
    // Navigate back to signature selection page
    onNavigate('signature');
  };

  React.useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.lineCap = 'round';
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      contextRef.current = context;

      // Fill with white background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('signature')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Signatures</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <img 
            src="/images/is-bg-white.logo.png" 
            alt="InduSign Logo" 
            className="h-8 w-auto"
          />
          <h1 className="text-2xl font-bold text-gray-900">Create Signature</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creation Area */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'draw'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Draw Signature</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Drawing Area */}
          {activeTab === 'draw' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Draw Your Signature</h3>
              
              <div className="border-2 border-gray-300 rounded-lg p-4 mb-4">
                <canvas
                  ref={canvasRef}
                  className="w-full h-64 border border-gray-200 rounded cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={clearCanvas}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear</span>
                </button>
                
                <button
                  onClick={saveSignature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Drawing
                </button>
              </div>
            </div>
          )}

          {/* Upload Area */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Signature Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                
                {uploadedFile ? (
                  <div>
                    <div className="mb-4">
                      <img 
                        src={uploadedFile} 
                        alt="Uploaded signature" 
                        className="max-w-full h-32 object-contain mx-auto border border-gray-200 rounded"
                      />
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Drop your signature image here, or click to browse
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Supports PNG, JPG, GIF up to 5MB
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        Choose File
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings & Preview */}
        <div className="space-y-6">
          {/* Signature Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Signature Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="e.g., John Doe, Formal Signature"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature Type</label>
                <select
                  value={signatureType}
                  onChange={(e) => setSignatureType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {signatureTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            
            {signature ? (
              <div className="text-center">
                <div className="border-2 border-gray-200 rounded-lg p-4 mb-4 bg-white">
                  <img 
                    src={signature} 
                    alt="Signature preview" 
                    className="max-w-full h-32 object-contain mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{signatureName || 'Unnamed Signature'}</p>
                  <p className="text-sm text-gray-600">{signatureType}</p>
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Ready to save</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {activeTab === 'draw' 
                    ? 'Draw your signature to see preview' 
                    : 'Upload an image to see preview'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              onClick={handleSaveSignature}
              disabled={!signature || !signatureName.trim()}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                signature && signatureName.trim()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Signature</span>
              </div>
            </button>
            
            {(!signature || !signatureName.trim()) && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {!signature ? 'Create or upload a signature first' : 'Enter a name for your signature'}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Draw your signature using the mouse or touch</li>
              <li>• Or upload an image of your signature</li>
              <li>• Give your signature a descriptive name</li>
              <li>• Choose the appropriate signature type</li>
              <li>• Click "Save Signature" when ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSignature; 