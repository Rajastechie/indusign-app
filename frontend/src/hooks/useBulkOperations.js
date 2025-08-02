import { useState, useCallback } from 'react';

export const useBulkOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({
    completed: 0,
    total: 0,
    failed: 0,
    current: null
  });
  const [operationHistory, setOperationHistory] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);

  // Process documents in batches
  const processBatch = useCallback(async (documents, operation, options = {}) => {
    const {
      batchSize = 10,
      autoRetry = true,
      maxRetries = 3,
      delayBetweenBatches = 1000
    } = options;

    setIsProcessing(true);
    setProcessingProgress({
      completed: 0,
      total: documents.length,
      failed: 0,
      current: null
    });

    const results = {
      successful: [],
      failed: [],
      retried: []
    };

    try {
      // Process documents in batches
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        
        // Process each document in the batch
        for (const document of batch) {
          setProcessingProgress(prev => ({
            ...prev,
            current: document.name
          }));

          let success = false;
          let retries = 0;

          // Try operation with retries if enabled
          while (!success && retries < maxRetries) {
            try {
              await operation(document);
              success = true;
              results.successful.push(document);
              
              setProcessingProgress(prev => ({
                ...prev,
                completed: prev.completed + 1
              }));
            } catch (error) {
              retries++;
              
              if (retries >= maxRetries) {
                results.failed.push({ document, error: error.message });
                
                setProcessingProgress(prev => ({
                  ...prev,
                  failed: prev.failed + 1
                }));
              } else if (autoRetry) {
                results.retried.push({ document, retries });
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
        }

        // Delay between batches to prevent overwhelming the system
        if (i + batchSize < documents.length) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }

      // Add to operation history
      const historyEntry = {
        id: Date.now(),
        type: currentOperation,
        timestamp: new Date().toISOString(),
        total: documents.length,
        successful: results.successful.length,
        failed: results.failed.length,
        retried: results.retried.length
      };

      setOperationHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

      return results;
    } finally {
      setIsProcessing(false);
      setCurrentOperation(null);
      setProcessingProgress({
        completed: 0,
        total: 0,
        failed: 0,
        current: null
      });
    }
  }, [currentOperation]);

  // Bulk download operation
  const bulkDownload = useCallback(async (documents, options = {}) => {
    setCurrentOperation('download');
    
    return await processBatch(documents, async (document) => {
      // Simulate download operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (window.electronAPI) {
        const result = await window.electronAPI.saveFile({
          filename: document.name,
          content: `Mock content for ${document.name}`
        });
        if (!result.success) {
          throw new Error('Download failed');
        }
      } else {
        // Web fallback
        const blob = new Blob([`Mock content for ${document.name}`], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, options);
  }, [processBatch]);

  // Bulk delete operation
  const bulkDelete = useCallback(async (documents, options = {}) => {
    setCurrentOperation('delete');
    
    return await processBatch(documents, async (document) => {
      // Simulate delete operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In real implementation, make API call to delete document
      console.log(`Deleting document: ${document.name}`);
      
      // Simulate occasional failure
      if (Math.random() < 0.1) {
        throw new Error('Delete operation failed');
      }
    }, options);
  }, [processBatch]);

  // Bulk email operation
  const bulkEmail = useCallback(async (documents, options = {}) => {
    setCurrentOperation('email');
    
    return await processBatch(documents, async (document) => {
      // Simulate email operation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate email content
      const { subject, body } = generateEmailContent([document]);
      
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      try {
        if (window.electronAPI) {
          await window.electronAPI.openExternal(mailtoLink);
        } else {
          const link = document.createElement('a');
          link.href = mailtoLink;
          link.click();
        }
      } catch (error) {
        throw new Error('Email client not available');
      }
    }, options);
  }, [processBatch]);

  // Bulk WhatsApp operation
  const bulkWhatsApp = useCallback(async (documents, options = {}) => {
    setCurrentOperation('whatsapp');
    
    return await processBatch(documents, async (document) => {
      // Simulate WhatsApp operation
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Generate WhatsApp content
      const { message } = generateWhatsAppContent([document]);
      
      // This would typically open WhatsApp with the message
      console.log(`Sharing via WhatsApp: ${document.name}`);
    }, options);
  }, [processBatch]);

  // Cancel current operation
  const cancelOperation = useCallback(() => {
    setIsProcessing(false);
    setCurrentOperation(null);
    setProcessingProgress({
      completed: 0,
      total: 0,
      failed: 0,
      current: null
    });
  }, []);

  // Generate email content
  const generateEmailContent = (documents) => {
    const documentLinks = documents.map(doc => ({
      name: doc.name,
      signLink: `${window.location.origin}/sign/${doc.id}`,
      viewLink: `${window.location.origin}/view/${doc.id}`
    }));

    const subject = `Documents for Signature - ${documents.length} document(s)`;
    const body = `Hello,\n\nPlease review and sign the following documents:\n\n${documentLinks.map(doc => 
      `• ${doc.name}\n  - Sign: ${doc.signLink}\n  - View: ${doc.viewLink}`
    ).join('\n\n')}\n\nBest regards,\nInduSign Team`;

    return { subject, body, documentLinks };
  };

  // Generate WhatsApp content
  const generateWhatsAppContent = (documents) => {
    const documentLinks = documents.map(doc => ({
      name: doc.name,
      signLink: `${window.location.origin}/sign/${doc.id}`,
      viewLink: `${window.location.origin}/view/${doc.id}`
    }));

    const message = `Hello! 📄\n\nPlease review and sign these documents:\n\n${documentLinks.map(doc => 
      `📋 ${doc.name}\n   ✍️ Sign: ${doc.signLink}\n   👁️ View: ${doc.viewLink}`
    ).join('\n\n')}\n\nThanks! 🙏\nInduSign Team`;

    return { message, documentLinks };
  };

  return {
    // State
    isProcessing,
    processingProgress,
    operationHistory,
    currentOperation,
    
    // Operations
    bulkDownload,
    bulkDelete,
    bulkEmail,
    bulkWhatsApp,
    cancelOperation,
    
    // Utilities
    generateEmailContent,
    generateWhatsAppContent
  };
}; 