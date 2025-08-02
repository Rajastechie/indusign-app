import React from 'react';

const ActivityChart = ({ 
  data, 
  selectedMetric, 
  onMetricChange, 
  title = 'Activity Trends',
  height = 'h-64'
}) => {
  const getMetricLabel = (metric) => {
    switch (metric) {
      case 'documents': return 'Documents';
      case 'signatures': return 'Signatures';
      case 'users': return 'Users';
      default: return 'Documents';
    }
  };

  const getMaxValue = () => {
    return Math.max(...data.map(item => item.value));
  };

  const getBarHeight = (value) => {
    const maxValue = getMaxValue();
    return maxValue > 0 ? (value / maxValue) * 200 : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <select
          value={selectedMetric}
          onChange={(e) => onMetricChange(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="documents">Documents</option>
          <option value="signatures">Signatures</option>
          <option value="users">Users</option>
        </select>
      </div>
      
      <div className={`${height} flex items-end justify-between space-x-2`}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${getBarHeight(item.value)}px` }}
              title={`${getMetricLabel(selectedMetric)}: ${item.value}`}
            ></div>
            <p className="text-xs text-gray-500 mt-2 text-center">{item.label}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Showing {getMetricLabel(selectedMetric)} over time
        </p>
      </div>
    </div>
  );
};

export default ActivityChart; 