import React, { useRef, useState, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, Upload, Trash2, Download } from 'lucide-react';

const SignaturePad = ({ onSignatureCreate }) => {
  const signatureRef = useRef();
  const [signatureMode, setSignatureMode] = useState('draw'); // 'draw' or 'upload'
  const [signatureImage, setSignatureImage] = useState(null);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    setSignatureImage(null);
    onSignatureCreate(null);
  };

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signatureData = signatureRef.current.toDataURL();
      setSignatureImage(signatureData);
      onSignatureCreate(signatureData);
    } else {
      alert('Please draw a signature first.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setSignatureImage(imageData);
        onSignatureCreate(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSignature = () => {
    if (signatureImage) {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = signatureImage;
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSignatureMode('draw')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            signatureMode === 'draw'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <PenTool className="w-4 h-4 inline mr-2" />
          Draw
        </button>
        <button
          onClick={() => setSignatureMode('upload')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            signatureMode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload
        </button>
      </div>

      {/* Signature Canvas */}
      {signatureMode === 'draw' && (
        <div className="space-y-3">
          <div className="border-2 border-gray-300 rounded-lg bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: 'signature-canvas w-full h-48'
              }}
              backgroundColor="white"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={saveSignature}
              className="btn-primary flex-1"
            >
              Save Signature
            </button>
            <button
              onClick={clearSignature}
              className="btn-secondary flex-1"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Image Upload */}
      {signatureMode === 'upload' && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="signature-upload"
            />
            <label
              htmlFor="signature-upload"
              className="cursor-pointer block"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Click to upload signature image</p>
              <p className="text-sm text-gray-500">PNG, JPG, SVG supported</p>
            </label>
          </div>
        </div>
      )}

      {/* Preview */}
      {signatureImage && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Signature Preview</h4>
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <img
              src={signatureImage}
              alt="Signature"
              className="max-w-full h-20 object-contain mx-auto"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={downloadSignature}
              className="btn-secondary flex-1"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Download
            </button>
            <button
              onClick={clearSignature}
              className="btn-secondary flex-1"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignaturePad; 