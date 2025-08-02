import React from 'react';

const DistributionChart = ({ 
  data, 
  title, 
  colorFunction,
  showPercentages = true,
  showCounts = true
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${colorFunction(item, index)}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {item.status || item.type}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colorFunction(item, index)}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              {showCounts && (
                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.count}
                </span>
              )}
              {showPercentages && (
                <span className="text-sm text-gray-500 w-12 text-right">
                  {item.percentage}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionChart; 