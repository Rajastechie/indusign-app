import React, { useState, useEffect } from 'react';
import { PDFDocument, PDFImage } from 'pdf-lib';
import PDFViewer from './components/PDFViewer';
import SignaturePad from './components/SignaturePad';
import FileUpload from './components/FileUpload';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DocRepo from './pages/DocRepoModular';
import UploadPage from './pages/Upload';
import Signature from './pages/Signature';
import PDFViewerPage from './pages/PDFViewer';
import Settings from './pages/Settings';
import CreateSignature from './pages/CreateSignature';
import Login from './pages/Login';
import Analytics from './pages/AnalyticsModular';
import DocumentComments from './pages/DocumentComments';
import { initializeLanguage } from './utils/language';
import './App.css';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const [signedPdf, setSignedPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // Start with login page
  const [pageParams, setPageParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state

  // Initialize language when app starts
  useEffect(() => {
    initializeLanguage();
  }, []);

  const handleFileUpload = (file) => {
    setPdfFile(file);
    setSignedPdf(null);
    setSignaturePosition(null);
  };

  const handleSignatureCreate = (signatureData) => {
    setSignature(signatureData);
  };

  const handleSignaturePlacement = (position) => {
    setSignaturePosition(position);
  };

  const handleDownload = async () => {
    if (pdfFile && signature && signaturePosition) {
      try {
        console.log('Creating signed PDF...');
        
        // Convert signature data URL to image
        const signatureImage = new Image();
        signatureImage.src = signature;
        
        await new Promise((resolve) => {
          signatureImage.onload = resolve;
        });
        
        // Create canvas to get image data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = signatureImage.width;
        canvas.height = signatureImage.height;
        ctx.drawImage(signatureImage, 0, 0);
        
        // Convert canvas to blob
        const imageBlob = await new Promise((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });
        
        // Load the PDF
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Get the first page
        const pages = pdfDoc.getPages();
        const page = pages[signaturePosition.page - 1];
        
        // Convert signature image to PDF image
        const imageBytes = await imageBlob.arrayBuffer();
        const pdfImage = await pdfDoc.embedPng(imageBytes);
        
        // Calculate position in PDF coordinates
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        
        // Convert percentage coordinates to PDF coordinates
        const x = (signaturePosition.x / 100) * pageWidth;
        const y = pageHeight - ((signaturePosition.y / 100) * pageHeight); // Flip Y coordinate
        
        // Add signature image to PDF
        const imageWidth = 150; // Adjust signature size
        const imageHeight = 60;
        
        page.drawImage(pdfImage, {
          x: x,
          y: y - imageHeight, // Position below the calculated point
          width: imageWidth,
          height: imageHeight,
        });
        
        // Save the signed PDF
        const signedPdfBytes = await pdfDoc.save();
        
        // Create download link
        const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `signed_${pdfFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Signed PDF downloaded successfully!');
        alert('Signed PDF downloaded successfully!');
        
      } catch (error) {
        console.error('Error creating signed PDF:', error);
        alert('Error creating signed PDF. Please try again.');
      }
    } else {
      alert('Please upload a PDF, create a signature, and place it on the document.');
    }
  };

  // Enhanced navigation with parameters
  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    
    // If navigating to dashboard after login, set logged in state
    if (page === 'dashboard') {
      setIsLoggedIn(true);
    }
  };

  // Simple routing
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'docrepo':
        return <DocRepo onNavigate={handleNavigate} />;
      case 'upload':
        return <UploadPage onNavigate={handleNavigate} />;
      case 'signature':
        return <Signature onNavigate={handleNavigate} uploadedFile={pageParams.uploadedFile} />;
      case 'pdfviewer':
        return <PDFViewerPage onNavigate={handleNavigate} uploadedFile={pageParams.uploadedFile} selectedSignature={pageParams.selectedSignature} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      case 'analytics':
        return <Analytics onNavigate={handleNavigate} />;
      case 'comments':
        return <DocumentComments onNavigate={handleNavigate} document={pageParams.document} />;
      case 'createsignature':
        return <CreateSignature onNavigate={handleNavigate} />;
      default:
        return <Login onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show header if user is logged in and not on login page */}
      {isLoggedIn && currentPage !== 'login' && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      <div className={isLoggedIn && currentPage !== 'login' ? 'pt-4' : ''}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App; 