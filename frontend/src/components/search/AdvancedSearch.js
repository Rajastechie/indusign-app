import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const AdvancedSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onSaveSearch, 
  onClearFilters,
  searchHistory,
  savedSearches,
  onLoadSavedSearch,
  advancedFilters,
  onAdvancedFiltersChange,
  statusFilter,
  onStatusFilterChange,
  folderFilter,
  onFolderFilterChange,
  folders
}) => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  const handleSearchChange = (value) => {
    onSearchChange(value);
    setShowSearchSuggestions(value.length > 0);
  };

  const handleSearchSuggestion = (suggestion) => {
    onSearchChange(suggestion);
    setShowSearchSuggestions(false);
  };

  const getSearchSuggestions = () => {
    const suggestions = [];
    
    // Add search history
    suggestions.push(...searchHistory.map(item => ({ type: 'history', text: item })));
    
    // Add document names, signers, and tags (this would come from props in real implementation)
    // For now, we'll use mock data
    const mockDocuments = [
      { name: 'Contract_2024.pdf', signer: 'John Doe', tags: ['contract', 'legal'] },
      { name: 'Invoice_001.pdf', signer: 'Jane Smith', tags: ['invoice', 'finance'] },
      { name: 'Agreement.pdf', signer: 'Mike Johnson', tags: ['agreement', 'partnership'] }
    ];
    
    mockDocuments.forEach(doc => {
      if (doc.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'document', text: doc.name });
      }
      if (doc.signer.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'signer', text: doc.signer });
      }
      doc.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.push({ type: 'tag', text: tag });
        }
      });
    });
    
    // Remove duplicates and limit to 10
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.text === suggestion.text)
    ).slice(0, 10);
    
    return uniqueSuggestions;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar with Advanced Features */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Enhanced Search */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents, descriptions, signers, tags..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Advanced Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Saved Searches"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Suggestions */}
            {showSearchSuggestions && searchTerm.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getSearchSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSuggestion(suggestion.text)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      suggestion.type === 'history' ? 'bg-blue-500' :
                      suggestion.type === 'document' ? 'bg-green-500' :
                      suggestion.type === 'signer' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></span>
                    <span className="text-sm">{suggestion.text}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {suggestion.type === 'history' ? 'Recent' :
                       suggestion.type === 'document' ? 'Document' :
                       suggestion.type === 'signer' ? 'Signer' : 'Tag'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSaveSearch}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Search
            </button>
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="signed">Signed</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Folder Filter */}
          <div className="lg:w-48">
            <select
              value={folderFilter}
              onChange={(e) => onFolderFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Folders</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedSearch && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Signer Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signer</label>
                <input
                  type="text"
                  placeholder="Filter by signer..."
                  value={advancedFilters.signerFilter}
                  onChange={(e) => onAdvancedFiltersChange({ ...advancedFilters, signerFilter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Document Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={advancedFilters.documentType}
                  onChange={(e) => onAdvancedFiltersChange({ ...advancedFilters, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">DOC</option>
                  <option value="docx">DOCX</option>
                </select>
              </div>

              {/* File Size Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Size (MB)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={advancedFilters.fileSize.min}
                    onChange={(e) => onAdvancedFiltersChange({ 
                      ...advancedFilters, 
                      fileSize: { ...advancedFilters.fileSize, min: e.target.value }
                    })}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={advancedFilters.fileSize.max}
                    onChange={(e) => onAdvancedFiltersChange({ 
                      ...advancedFilters, 
                      fileSize: { ...advancedFilters.fileSize, max: e.target.value }
                    })}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={advancedFilters.dateRange.start}
                    onChange={(e) => onAdvancedFiltersChange({ 
                      ...advancedFilters, 
                      dateRange: { ...advancedFilters.dateRange, start: e.target.value }
                    })}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={advancedFilters.dateRange.end}
                    onChange={(e) => onAdvancedFiltersChange({ 
                      ...advancedFilters, 
                      dateRange: { ...advancedFilters.dateRange, end: e.target.value }
                    })}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Searches Dropdown */}
      {showSavedSearches && (
        <div className="absolute z-50 w-80 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Saved Searches</h3>
          </div>
          {savedSearches.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No saved searches yet
            </div>
          ) : (
            savedSearches.map((savedSearch, index) => (
              <button
                key={index}
                onClick={() => onLoadSavedSearch(savedSearch)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-sm">{savedSearch.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(savedSearch.timestamp).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch; 