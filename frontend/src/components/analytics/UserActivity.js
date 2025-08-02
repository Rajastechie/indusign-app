import React from 'react';

const UserActivity = ({ users, title = 'Top Active Users' }) => {
  const getAvatarColor = (index) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-red-500', 'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center`}>
                <span className="text-white text-sm font-medium">
                  {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.lastActive}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.documents} docs</p>
              <p className="text-xs text-gray-500">{user.signatures} signatures</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivity; 