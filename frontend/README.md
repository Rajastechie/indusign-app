# InduSign - eSignature Application

A professional Electron + React desktop application for creating and managing digital signatures on PDF documents.

## Features

- 📄 **PDF Upload & Viewing**: Upload and view PDF documents using react-pdf
- ✍️ **Signature Creation**: Draw signatures or upload signature images
- 🎯 **Smart Placement**: Automatically detect placeholder text and place signatures
- 📍 **Manual Placement**: Click anywhere on the document to place signatures
- 🔍 **Document Navigation**: Zoom, rotate, and navigate through multi-page PDFs
- 💾 **Export Functionality**: Download signed PDF documents
- 🎨 **Modern UI**: Clean, industrial-friendly interface built with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Start the React development server:
```bash
npm start
```

### Start the Electron app in development mode:
```bash
npm run electron-dev
```

This will start both the React development server and Electron app simultaneously.

## Building

### Build for production:
```bash
npm run build
```

### Create distributable packages:
```bash
npm run dist
```

This will create platform-specific installers in the `dist` folder.

## Project Structure

```
frontend/
├── public/
│   ├── electron.js          # Main Electron process
│   ├── preload.js           # Preload script for security
│   └── index.html           # Main HTML file
├── src/
│   ├── components/
│   │   ├── Header.js        # Application header
│   │   ├── FileUpload.js    # PDF file upload component
│   │   ├── SignaturePad.js  # Signature creation component
│   │   └── PDFViewer.js     # PDF viewing and signature placement
│   ├── App.js               # Main application component
│   ├── index.js             # React entry point
│   └── index.css            # Global styles with Tailwind
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Key Technologies

- **Electron**: Desktop application framework
- **React**: UI library
- **react-pdf**: PDF viewing and manipulation
- **react-signature-canvas**: Signature drawing
- **react-dropzone**: File upload functionality
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Usage

1. **Upload PDF**: Drag and drop or click to upload a PDF document
2. **Create Signature**: 
   - Draw your signature using the signature pad
   - Or upload an existing signature image
3. **Place Signature**:
   - Click on highlighted placeholder text areas for automatic placement
   - Or use the "Place Signature" button to click anywhere on the document
4. **Download**: Click the "Download Signed PDF" button to save your signed document

## Development Notes

- The application uses Electron's contextIsolation for security
- PDF.js worker is loaded from CDN for PDF processing
- Placeholder text detection is currently simulated (would need backend integration for real text extraction)
- Signature placement coordinates are calculated relative to the PDF scale and rotation

## Future Enhancements

- Backend integration for PDF text extraction
- Multiple signature support
- Digital certificate integration
- Cloud storage integration
- Batch processing capabilities
- Advanced PDF editing features 