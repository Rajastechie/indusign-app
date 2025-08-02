import { useState, useMemo } from 'react';

export const useAdvancedSearch = (documents) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [advancedFilters, setAdvancedFilters] = useState({
    fileSize: { min: '', max: '' },
    documentType: 'all',
    signerFilter: '',
    dateRange: { start: '', end: '' },
    tags: []
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique folders
  const folders = useMemo(() => {
    const uniqueFolders = [...new Set(documents.map(doc => doc.folder))];
    return uniqueFolders.sort();
  }, [documents]);

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Advanced search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.signer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.folder.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Folder filter
    if (folderFilter !== 'all') {
      filtered = filtered.filter(doc => doc.folder === folderFilter);
    }

    // Advanced filters
    if (advancedFilters.signerFilter) {
      filtered = filtered.filter(doc => 
        doc.signer.toLowerCase().includes(advancedFilters.signerFilter.toLowerCase())
      );
    }

    if (advancedFilters.documentType !== 'all') {
      filtered = filtered.filter(doc => {
        const docType = doc.name.split('.').pop().toLowerCase();
        return docType === advancedFilters.documentType;
      });
    }

    if (advancedFilters.fileSize.min || advancedFilters.fileSize.max) {
      filtered = filtered.filter(doc => {
        const size = parseFloat(doc.fileSize);
        const minSize = advancedFilters.fileSize.min ? parseFloat(advancedFilters.fileSize.min) : 0;
        const maxSize = advancedFilters.fileSize.max ? parseFloat(advancedFilters.fileSize.max) : Infinity;
        return size >= minSize && size <= maxSize;
      });
    }

    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(doc => 
        advancedFilters.tags.some(tag => doc.tags.includes(tag))
      );
    }

    // Date filter (enhanced)
    if (dateFilter.start || dateFilter.end || advancedFilters.dateRange.start || advancedFilters.dateRange.end) {
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.dateCreated);
        const startDate = dateFilter.start || advancedFilters.dateRange.start ? 
          new Date(dateFilter.start || advancedFilters.dateRange.start) : null;
        const endDate = dateFilter.end || advancedFilters.dateRange.end ? 
          new Date(dateFilter.end || advancedFilters.dateRange.end) : null;
        
        if (startDate && endDate) {
          return docDate >= startDate && docDate <= endDate;
        } else if (startDate) {
          return docDate >= startDate;
        } else if (endDate) {
          return docDate <= endDate;
        }
        return true;
      });
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
          break;
        case 'size':
          aValue = parseFloat(a.fileSize);
          bValue = parseFloat(b.fileSize);
          break;
        case 'signer':
          aValue = a.signer.toLowerCase();
          bValue = b.signer.toLowerCase();
          break;
        default:
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [documents, searchTerm, statusFilter, folderFilter, dateFilter, advancedFilters, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Search functions
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    // Add to search history if not empty
    if (value.trim() && !searchHistory.includes(value.trim())) {
      setSearchHistory(prev => [value.trim(), ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  };

  const saveCurrentSearch = () => {
    const searchQuery = {
      name: `Search: ${searchTerm}`,
      query: searchTerm,
      filters: {
        status: statusFilter,
        folder: folderFilter,
        dateRange: dateFilter,
        advanced: advancedFilters
      },
      timestamp: new Date().toISOString()
    };
    
    setSavedSearches(prev => [searchQuery, ...prev.slice(0, 9)]); // Keep last 10 saved searches
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchTerm(savedSearch.query);
    setStatusFilter(savedSearch.filters.status);
    setFolderFilter(savedSearch.filters.folder);
    setDateFilter(savedSearch.filters.dateRange);
    setAdvancedFilters(savedSearch.filters.advanced);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFolderFilter('all');
    setDateFilter({ start: '', end: '' });
    setAdvancedFilters({
      fileSize: { min: '', max: '' },
      documentType: 'all',
      signerFilter: '',
      dateRange: { start: '', end: '' },
      tags: []
    });
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    // State
    searchTerm,
    searchHistory,
    savedSearches,
    statusFilter,
    folderFilter,
    dateFilter,
    advancedFilters,
    sortBy,
    sortOrder,
    currentPage,
    totalPages,
    folders,
    filteredDocuments,
    currentDocuments,
    
    // Actions
    setSearchTerm: handleSearchChange,
    setStatusFilter,
    setFolderFilter,
    setDateFilter,
    setAdvancedFilters,
    saveCurrentSearch,
    loadSavedSearch,
    clearAllFilters,
    handleSort,
    handlePageChange
  };
}; 