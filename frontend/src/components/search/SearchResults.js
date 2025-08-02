import React from 'react';

const SearchResults = ({
  filteredCount,
  totalCount,
  searchTerm,
  currentPage,
  totalPages
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {filteredCount} of {totalCount} documents
        {searchTerm && (
          <span className="ml-2">
            for "<span className="font-medium">{searchTerm}</span>"
          </span>
        )}
      </div>
      <div className="text-sm text-gray-500">
        {filteredCount > 0 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 