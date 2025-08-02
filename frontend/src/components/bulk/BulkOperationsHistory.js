import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Mail,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const BulkOperationsHistory = ({ operationHistory, onRetryOperation }) => {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getOperationIcon = (type) => {
    switch (type) {
      case 'download': return Download;
      case 'delete': return Trash2;
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      default: return Clock;
    }
  };

  const getOperationColor = (type) => {
    switch (type) {
      case 'download': return 'text-green-600 bg-green-100';
      case 'delete': return 'text-red-600 bg-red-100';
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'whatsapp': return 'text-green-500 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuccessRate = (operation) => {
    const total = operation.total;
    const successful = operation.successful;
    return total > 0 ? Math.round((successful / total) * 100) : 0;
  };

  const getStatusIcon = (operation) => {
    const successRate = getSuccessRate(operation);
    
    if (successRate === 100) {
      return { icon: CheckCircle, color: 'text-green-600', text: 'Completed' };
    } else if (successRate > 0) {
      return { icon: AlertCircle, color: 'text-yellow-600', text: 'Partial Success' };
    } else {
      return { icon: AlertCircle, color: 'text-red-600', text: 'Failed' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (operationHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Operations Yet</h3>
          <p className="text-gray-600">Bulk operations history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Operation History</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="space-y-4">
        {operationHistory.map((operation) => {
          const Icon = getOperationIcon(operation.type);
          const status = getStatusIcon(operation);
          const successRate = getSuccessRate(operation);
          
          return (
            <div key={operation.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getOperationColor(operation.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {operation.type} Operation
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatTimestamp(operation.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <status.icon className={`w-4 h-4 ${status.color}`} />
                      <span className="text-sm font-medium text-gray-700">{status.text}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {operation.successful} of {operation.total} successful
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{successRate}%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Success Rate</span>
                  <span>{successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Statistics */}
              {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{operation.successful}</div>
                      <div className="text-xs text-gray-500">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{operation.failed}</div>
                      <div className="text-xs text-gray-500">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{operation.retried}</div>
                      <div className="text-xs text-gray-500">Retried</div>
                    </div>
                  </div>
                  
                  {operation.failed > 0 && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => onRetryOperation(operation)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Retry Failed</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{operationHistory.length}</div>
            <div className="text-xs text-gray-500">Total Operations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {operationHistory.reduce((sum, op) => sum + op.successful, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Successful</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {operationHistory.reduce((sum, op) => sum + op.failed, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Failed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round(
                operationHistory.reduce((sum, op) => sum + getSuccessRate(op), 0) / 
                operationHistory.length
              )}%
            </div>
            <div className="text-xs text-gray-500">Avg Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsHistory; 