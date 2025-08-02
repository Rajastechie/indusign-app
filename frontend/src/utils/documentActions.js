// Document action utilities
export const documentActions = {
  // Download document
  download: async (document) => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.saveFile({
          filename: document.name,
          content: `Mock content for ${document.name}` // In real app, this would be the actual file content
        });
        if (result.success) {
          console.log('Document downloaded successfully');
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
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  },

  // Delete document
  delete: async (document) => {
    try {
      // In real app, this would make an API call to delete the document
      console.log('Deleting document:', document.name);
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { success: false, error: error.message };
    }
  },

  // View document
  view: (document, onNavigate) => {
    try {
      onNavigate('pdfviewer', { document });
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  },

  // Edit document
  edit: (document, onNavigate) => {
    try {
      onNavigate('signature', { document });
    } catch (error) {
      console.error('Error editing document:', error);
    }
  }
};

// Bulk action utilities
export const bulkActions = {
  // Bulk download
  download: async (documents) => {
    try {
      for (const document of documents) {
        await documentActions.download(document);
      }
      console.log(`Downloaded ${documents.length} documents`);
    } catch (error) {
      console.error('Error in bulk download:', error);
    }
  },

  // Bulk delete
  delete: async (documents) => {
    try {
      for (const document of documents) {
        await documentActions.delete(document);
      }
      console.log(`Deleted ${documents.length} documents`);
    } catch (error) {
      console.error('Error in bulk delete:', error);
    }
  },

  // Generate email content
  generateEmailContent: (documents) => {
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
  },

  // Generate WhatsApp content
  generateWhatsAppContent: (documents) => {
    const documentLinks = documents.map(doc => ({
      name: doc.name,
      signLink: `${window.location.origin}/sign/${doc.id}`,
      viewLink: `${window.location.origin}/view/${doc.id}`
    }));

    const message = `Hello! 📄\n\nPlease review and sign these documents:\n\n${documentLinks.map(doc => 
      `📋 ${doc.name}\n   ✍️ Sign: ${doc.signLink}\n   👁️ View: ${doc.viewLink}`
    ).join('\n\n')}\n\nThanks! 🙏\nInduSign Team`;

    return { message, documentLinks };
  }
};

// Status utilities
export const statusUtils = {
  getIcon: (status) => {
    switch (status) {
      case 'signed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'draft':
        return 'Edit';
      default:
        return 'AlertCircle';
    }
  },

  getBadge: (status) => {
    switch (status) {
      case 'signed':
        return { text: 'Signed', className: 'bg-green-100 text-green-800' };
      case 'pending':
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
      case 'draft':
        return { text: 'Draft', className: 'bg-blue-100 text-blue-800' };
      default:
        return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  }
}; 