import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, RotateCw, Search, MousePointer, ChevronDown, Download } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, signature, onSignaturePlacement, signaturePosition, onDownload }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const [placeholderTexts, setPlaceholderTexts] = useState([]);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(null);
  const [showSignatureAreas, setShowSignatureAreas] = useState(false);
  const [showFitOptions, setShowFitOptions] = useState(false);
  const canvasRef = useRef(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // Set initial scale to fit width when page dimensions are available
  useEffect(() => {
    if (pageDimensions.width > 0 && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 40; // Account for padding
      const newScale = containerWidth / pageDimensions.width;
      setScale(Math.min(newScale, 3.0)); // Limit max scale
    }
  }, [pageDimensions.width]);

  useEffect(() => {
    if (file) {
      // Reset state when new file is loaded
      setPageNumber(1);
      setScale(1.0);
      setRotation(0);
      setIsPlacingSignature(false);
      setSelectedPlaceholder(null);
      setShowFitOptions(false);
      // Automatically detect placeholders when file loads
      detectPlaceholderTexts();
    }
  }, [file]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFitOptions && !event.target.closest('.fit-dropdown')) {
        setShowFitOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFitOptions]);

  const detectPlaceholderTexts = async () => {
    if (!file) return;
    
    try {
      console.log('Starting placeholder detection for entire PDF');
      
      // Convert file to ArrayBuffer for PDF.js
      const arrayBuffer = await file.arrayBuffer();
      
      // Use PDF.js to extract text content
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const foundPlaceholders = [];
      let foundPage = null;
      
      // Search through all pages
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        console.log(`Searching page ${pageNum} of ${totalPages}`);
        
        // Build complete text content for better detection
        let fullText = '';
        let textItems = [];
        
        textContent.items.forEach((item, index) => {
          const text = item.str.trim();
          console.log(`Page ${pageNum}, Text item ${index}: "${text}" at x=${item.transform[4]}, y=${item.transform[5]}, width=${item.width}`);
          
          if (text.length > 0) {
            fullText += text + ' ';
            textItems.push({
              text: text,
              item: item,
              index: index
            });
          }
        });
        
        console.log(`Page ${pageNum} full text: "${fullText.trim()}"`);
        
                // Look specifically for "Authorized Signature:" pattern
        const lowerFullText = fullText.toLowerCase();
        let placeholder = null;
        let matchingItems = [];
        
        console.log(`Page ${pageNum} - Full text: "${fullText.trim()}"`);
        console.log(`Page ${pageNum} - All text items:`, textItems.map(ti => ({
          text: ti.text,
          x: ti.item.transform[4],
          y: ti.item.transform[5],
          width: ti.item.width
        })));
        
        // Look for text items that contain "Signature" (most likely to be the actual signature line)
        const signatureItems = textItems.filter(ti => 
          ti.text.toLowerCase().includes('signature')
        );
        
        console.log(`Page ${pageNum} - Signature items found:`, signatureItems.map(si => ({
          text: si.text,
          x: si.item.transform[4],
          y: si.item.transform[5],
          width: si.item.width
        })));
        
        // Also look for items containing "Authorized" as a fallback
        const authorizedItems = textItems.filter(ti => 
          ti.text.toLowerCase().includes('authorized')
        );
        
        console.log(`Page ${pageNum} - Authorized items found:`, authorizedItems.map(ai => ({
          text: ai.text,
          x: ai.item.transform[4],
          y: ai.item.transform[5],
          width: ai.item.width
        })));
        
        if (signatureItems.length > 0) {
          // Check if we have both "Authorised" and "Signature" on the same line
          const authorizedItems = textItems.filter(ti => 
            ti.text.toLowerCase().includes('authorised') || ti.text.toLowerCase().includes('authorized')
          );
          
          // Find items on the same line as the signature
          const signatureY = signatureItems[0].item.transform[5];
          const sameLineItems = textItems.filter(ti => {
            const yDiff = Math.abs(ti.item.transform[5] - signatureY);
            return yDiff < 3; // Same line
          });
          
          console.log(`Page ${pageNum} - Same line items:`, sameLineItems.map(sli => ({
            text: sli.text,
            x: sli.item.transform[4],
            y: sli.item.transform[5],
            width: sli.item.width
          })));
          
          // Look for "Authorised" and "Signature" on the same line
          const authorisedItem = sameLineItems.find(ti => 
            ti.text.toLowerCase().includes('authorised') || ti.text.toLowerCase().includes('authorized')
          );
          const signatureItem = sameLineItems.find(ti => 
            ti.text.toLowerCase().includes('signature')
          );
          
          if (authorisedItem && signatureItem) {
            // We have both parts, create a combined placeholder
            placeholder = 'Authorized Signature';
            matchingItems = [authorisedItem, signatureItem];
            
            console.log(`Page ${pageNum} - Found combined: "${authorisedItem.text} ${signatureItem.text}"`);
          } else {
            // Use the first signature item found
            const signatureItem = signatureItems[0];
            placeholder = 'Authorized Signature';
            matchingItems = [signatureItem];
            
            console.log(`Page ${pageNum} - Using signature item: "${signatureItem.text}" at x=${signatureItem.item.transform[4]}, y=${signatureItem.item.transform[5]}`);
          }
        } else if (authorizedItems.length > 0) {
          // Fallback: use the first authorized item
          const authorizedItem = authorizedItems[0];
          placeholder = 'Authorized Signature';
          matchingItems = [authorizedItem];
          
          console.log(`Page ${pageNum} - Using authorized item: "${authorizedItem.text}" at x=${authorizedItem.item.transform[4]}, y=${authorizedItem.item.transform[5]}`);
        }
        
        console.log(`Page ${pageNum} - Found placeholder: "${placeholder}"`);
        
        if (placeholder && matchingItems.length > 0) {
          
          console.log(`Page ${pageNum} - Matching items:`, matchingItems.map(mi => ({
            text: mi.text,
            x: mi.item.transform[4],
            y: mi.item.transform[5],
            width: mi.item.width
          })));
          
          if (matchingItems.length > 0) {
            // Handle multiple matching items (like "Authorised" + "Signature")
            let startItem = matchingItems[0];
            let endItem = matchingItems[matchingItems.length - 1];
            let totalWidth = 0;
            
            // Calculate total width from start of first item to end of last item
            const firstItem = matchingItems[0];
            const lastItem = matchingItems[matchingItems.length - 1];
            
            const startX = firstItem.item.transform[4];
            const endX = lastItem.item.transform[4] + (lastItem.item.width || lastItem.text.length * 8);
            totalWidth = endX - startX;
            
            console.log(`Page ${pageNum} - Width calculation: startX=${startX}, endX=${endX}, totalWidth=${totalWidth}`);
            
            // Use the first matching item for positioning
            const item = startItem.item;
            const text = startItem.text;
            
            // Calculate position based on PDF coordinates
            const x = item.transform[4]; // x position
            const y = item.transform[5]; // y position
            const width = totalWidth; // Use total width of all consecutive items
            const height = item.height || 20;
            
            // Convert PDF coordinates to screen coordinates (same as manual placement)
            const pageViewport = page.getViewport({ scale: 1.0 });
            console.log(`Page ${pageNum} viewport: width=${pageViewport.width}, height=${pageViewport.height}`);
            
            // Use the same coordinate system as manual placement
            const screenX = (x / pageViewport.width) * 100;
            const screenY = ((pageViewport.height - y) / pageViewport.height) * 100; // Flip Y coordinate
            
            console.log(`Page ${pageNum} coordinate conversion: PDF(x=${x}, y=${y}) -> Screen(x=${screenX}%, y=${screenY}%)`);
            
            console.log('Found placeholder:', {
              text: text,
              placeholder: placeholder,
              page: pageNum,
              x: x,
              y: y,
              screenX: screenX,
              screenY: screenY,
              width: width,
              height: height,
              pageViewportWidth: pageViewport.width,
              pageViewportHeight: pageViewport.height,
              widthPercent: (width / pageViewport.width) * 100
            });
            
            foundPlaceholders.push({
              text: placeholder,
              x: screenX,
              y: screenY,
              width: width,
              height: height,
              originalText: text,
              page: pageNum
            });
            
            // Remember the first page where we found a placeholder
            if (!foundPage) {
              foundPage = pageNum;
            }
          }
        }
      }
      
      console.log('Total placeholders found:', foundPlaceholders.length);
      
      // If we found placeholders, navigate to the first page with a placeholder
      if (foundPage && foundPage !== pageNumber) {
        console.log(`Navigating to page ${foundPage} where placeholder was found`);
        setPageNumber(foundPage);
      }
      
      // Filter placeholders for current page
      const currentPagePlaceholders = foundPlaceholders.filter(p => p.page === (foundPage || pageNumber));
      setPlaceholderTexts(currentPagePlaceholders);
      
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      // Fallback to empty array if text extraction fails
      setPlaceholderTexts([]);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page) => {
    setPageDimensions({ width: page.originalWidth, height: page.originalHeight });
  };

  // Zoom functions commented out for now
  /*
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.3, 4.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.3, 0.3));
  };
  */

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Fit functions commented out for now
  /*
  const handleFitToWidth = () => {
    if (!containerRef.current || !pageDimensions.width) return;
    const containerWidth = containerRef.current.offsetWidth - 40; // Account for padding
    const newScale = containerWidth / pageDimensions.width;
    setScale(Math.min(newScale, 3.0)); // Limit max scale
    setShowFitOptions(false);
  };

  const handleFitToHeight = () => {
    if (!containerRef.current || !pageDimensions.height) return;
    const containerHeight = containerRef.current.offsetHeight - 80; // Account for padding
    const newScale = containerHeight / pageDimensions.height;
    setScale(Math.min(newScale, 3.0)); // Limit max scale
    setShowFitOptions(false);
  };

  const handleFitToPage = () => {
    if (!containerRef.current || !pageDimensions.width || !pageDimensions.height) return;
    const containerWidth = containerRef.current.offsetWidth - 40; // Account for padding
    const containerHeight = containerRef.current.offsetHeight - 80; // Account for padding
    const scaleW = containerWidth / pageDimensions.width;
    const scaleH = containerHeight / pageDimensions.height;
    setScale(Math.min(scaleW, scaleH, 3.0)); // Limit max scale
    setShowFitOptions(false);
  };

  const handleActualSize = () => {
    setScale(1.0);
    setShowFitOptions(false);
  };
  */

  const handlePlaceholderClick = (placeholder) => {
    if (signature) {
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Place signature below "${placeholder.originalText}"?\n\nThis will automatically position your signature below the detected text.`
      );
      
      if (confirmed) {
        placeSignatureAtPlaceholder(placeholder);
      }
    } else {
      alert('Please create a signature first.');
    }
  };

  const placeSignatureAtPlaceholder = (placeholder) => {
    // Place signature directly at the bottom edge of the placeholder
    const signatureX = placeholder.x; // Use placeholder X coordinate
    const signatureY = placeholder.y + (placeholder.height / pageDimensions.height * 100); // No additional gap
    const signaturePosition = {
      x: signatureX,
      y: signatureY,
      scale: 1,
      rotation: 0,
      page: placeholder.page
    };
    
    onSignaturePlacement(signaturePosition);
    
    console.log('Placing signature at:', signaturePosition);
    console.log('Original placeholder:', placeholder);
    setSelectedPlaceholder(null);
    setIsPlacingSignature(false);
  };

  const handlePlaceAllSignatures = () => {
    if (!signature) {
      alert('Please create a signature first.');
      return;
    }

    if (placeholderTexts.length === 0) {
      alert('No placeholders detected. Please upload a PDF with signature placeholders.');
      return;
    }

    const confirmed = window.confirm(
      `Place signature on all ${placeholderTexts.length} detected placeholders?\n\nThis will automatically place your signature below all detected signature fields.`
    );

    if (confirmed) {
      // Place signature on the first placeholder (for now, we'll handle multiple later)
      const firstPlaceholder = placeholderTexts[0];
      placeSignatureAtPlaceholder(firstPlaceholder);
      
      console.log(`Placed signature on ${placeholderTexts.length} placeholders`);
    }
  };

  const searchForText = async (searchTerm) => {
    if (!file) return;
    
    try {
      console.log('Searching for:', searchTerm);
      
      // Convert file to ArrayBuffer for PDF.js
      const arrayBuffer = await file.arrayBuffer();
      
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const foundItems = [];
      let foundPage = null;
      
      // Search through all pages
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        textContent.items.forEach((item, index) => {
          const text = item.str.trim();
          if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
            const x = item.transform[4];
            const y = item.transform[5];
            const width = item.width || text.length * 8;
            const height = item.height || 20;
            
            const pageViewport = page.getViewport({ scale: 1.0 });
            const screenX = (x / pageViewport.width) * 100;
            const screenY = ((pageViewport.height - y) / pageViewport.height) * 100; // Flip Y coordinate
            
            console.log('Found search term:', {
              text: text,
              searchTerm: searchTerm,
              page: pageNum,
              x: screenX,
              y: screenY
            });
            
            foundItems.push({
              text: searchTerm,
              x: screenX,
              y: screenY,
              width: width,
              height: height,
              originalText: text,
              page: pageNum
            });
            
            // Remember the first page where we found the search term
            if (!foundPage) {
              foundPage = pageNum;
            }
          }
        });
      }
      
      console.log('Search results:', foundItems.length);
      
      // If we found items, navigate to the first page with the search term
      if (foundPage && foundPage !== pageNumber) {
        console.log(`Navigating to page ${foundPage} where search term was found`);
        setPageNumber(foundPage);
      }
      
      // Filter items for current page
      const currentPageItems = foundItems.filter(p => p.page === (foundPage || pageNumber));
      setPlaceholderTexts(currentPageItems);
      setShowSignatureAreas(true);
    } catch (error) {
      console.error('Error searching PDF:', error);
    }
  };

  const handleCanvasClick = (event) => {
    if (!isPlacingSignature) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert click coordinates to PDF-relative positioning
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Convert screen coordinates to PDF coordinates
    const pdfX = (x / containerWidth) * pageDimensions.width;
    const pdfY = pageDimensions.height - ((y / containerHeight) * pageDimensions.height); // Flip Y coordinate
    
    // Convert PDF coordinates to percentage for rendering
    const percentX = (pdfX / pageDimensions.width) * 100;
    const percentY = ((pageDimensions.height - pdfY) / pageDimensions.height) * 100; // Flip back for display

    const position = {
      x: percentX,
      y: percentY,
      scale: scale,
      rotation: rotation,
      page: pageNumber
    };

    console.log('Manual signature placement at:', position);
    console.log('PDF coordinates:', { pdfX, pdfY, pageDimensions });
    onSignaturePlacement(position);
    setIsPlacingSignature(false);
    setSelectedPlaceholder(null);
  };

  const renderSignatureOverlay = () => {
    if (!signaturePosition || signaturePosition.page !== pageNumber) return null;

    console.log('Rendering signature at:', signaturePosition);

    // Use percentage coordinates directly for signature positioning
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${signaturePosition.x}%`,
          top: `${signaturePosition.y}%`,
          transform: `rotate(${signaturePosition.rotation}deg)`,
          zIndex: 10
        }}
      >
        <img
          src={signature}
          alt="Signature"
          className="max-w-32 max-h-16"
          style={{
            transform: `scale(${signaturePosition.scale})`,
            display: 'block',
            objectFit: 'contain',
            objectPosition: 'left top'
          }}
        />
      </div>
    );
  };

  const renderPlaceholderHighlights = () => {
    return placeholderTexts.map((placeholder, index) => {
      const widthPercent = Math.max(placeholder.width / pageDimensions.width * 100, 15);
      const heightPercent = Math.max(placeholder.height / pageDimensions.height * 100, 4);
      
      console.log(`Rendering placeholder ${index}:`, {
        text: placeholder.originalText,
        x: placeholder.x,
        y: placeholder.y,
        width: placeholder.width,
        widthPercent: widthPercent,
        height: placeholder.height,
        heightPercent: heightPercent,
        pageDimensions: pageDimensions
      });
      
      return (
        <div
          key={index}
          className={`absolute cursor-pointer transition-all duration-200 ${
            selectedPlaceholder === placeholder
              ? 'border-2 border-green-500 bg-green-50 bg-opacity-50'
              : 'hover:bg-green-50 hover:bg-opacity-30'
          }`}
          style={{
            left: `${placeholder.x}%`,
            top: `${placeholder.y}%`,
            width: `${widthPercent}%`,
            height: `${heightPercent}%`,
            zIndex: 5
          }}
          onClick={() => handlePlaceholderClick(placeholder)}
          title={`Click to place signature below "${placeholder.originalText}"`}
        >
          {/* Highlight the detected text */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${
            selectedPlaceholder === placeholder
              ? 'opacity-100'
              : 'opacity-0 hover:opacity-100'
          }`}>
            <div className="absolute inset-0 border-2 border-green-500 border-dashed bg-green-50 bg-opacity-30"></div>
            <div className="absolute -top-8 left-0 bg-green-600 text-white text-xs px-3 py-2 rounded shadow-sm">
              <div className="font-medium">{`"${placeholder.originalText}"`}</div>
              <div className="text-xs opacity-90">Click to sign below</div>
            </div>
          </div>
        </div>
      );
    });
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No PDF file loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Compact Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
        <div className="flex items-center space-x-2">
          {/* Zoom controls commented out for now */}
          {/* <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button> */}
          
          {/* Fit Options Dropdown - commented out */}
          {/* <div className="relative fit-dropdown">
            <button
              onClick={() => setShowFitOptions(!showFitOptions)}
              className="p-2 hover:bg-gray-200 rounded transition-colors flex items-center space-x-1"
              title="Fit Options"
            >
              <span className="text-sm">Fit</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showFitOptions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-36 fit-dropdown">
                <button
                  onClick={handleFitToWidth}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 border-b border-gray-100"
                >
                  Fit to Width
                </button>
                <button
                  onClick={handleFitToHeight}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 border-b border-gray-100"
                >
                  Fit to Page
                </button>
                <button
                  onClick={handleFitToPage}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 border-b border-gray-100"
                >
                  Fit to Page
                </button>
                <button
                  onClick={handleActualSize}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50"
                >
                  Actual Size
                </button>
              </div>
            )}
          </div> */}
          
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {pageNumber}/{numPages}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
              disabled={pageNumber >= numPages}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {signature && (
            <button
              onClick={() => setIsPlacingSignature(!isPlacingSignature)}
              className={`px-3 py-2 text-sm rounded transition-colors ${
                isPlacingSignature
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <MousePointer className="w-4 h-4 inline mr-1" />
              {isPlacingSignature ? 'Cancel' : 'Sign'}
            </button>
          )}
          
          <button
            onClick={handlePlaceAllSignatures}
            disabled={!signature || placeholderTexts.length === 0}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              signature && placeholderTexts.length > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="Automatically place signature on all detected placeholders"
          >
            <Search className="w-4 h-4 inline mr-1" />
            Place Signature
          </button>
          
          <button
            onClick={onDownload}
            disabled={!file || !signature || !signaturePosition}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              file && signature && signaturePosition
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="Export signed PDF"
          >
            <Download className="w-4 h-4 inline mr-1" />
            Export PDF
          </button>
          
          {/* Debug button - remove in production */}
          <button
            onClick={() => {
              console.log('Manual placeholder detection triggered');
              detectPlaceholderTexts();
            }}
            className="px-2 py-2 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
            title="Debug: Force placeholder detection"
          >
            Debug
          </button>
          

        </div>
      </div>

      {/* PDF Viewer - Full Size */}
      <div ref={containerRef} className="relative bg-white rounded-lg border border-gray-200 w-full h-[80vh] overflow-auto">
        <div
          ref={canvasRef}
          className="relative w-full min-h-full flex items-start justify-center p-4"
          onClick={handleCanvasClick}
          style={{ cursor: isPlacingSignature ? 'crosshair' : 'default' }}
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-4 text-center text-sm">Loading PDF...</div>}
            error={<div className="p-4 text-center text-red-600 text-sm">Error loading PDF</div>}
            renderMode="canvas"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              loading={<div className="p-4 text-center text-sm">Loading page...</div>}
              className="!m-0 !p-0 !border-0"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={onPageLoadSuccess}
            />
          </Document>

          {/* Placeholder highlights - always visible */}
          {renderPlaceholderHighlights()}

          {/* Signature overlay */}
          {renderSignatureOverlay()}

          {/* Minimal placement indicator */}
          {isPlacingSignature && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-blue-50 bg-opacity-10 border border-blue-300 border-dashed"></div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default PDFViewer; 