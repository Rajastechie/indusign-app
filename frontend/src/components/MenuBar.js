import React from 'react';
import { FileText, LayoutDashboard, Settings, HelpCircle } from 'lucide-react';

const MenuBar = ({ currentPage, onNavigate }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview and quick actions'
    },
    {
      id: 'docrepo',
      label: 'DocRepo',
      icon: FileText,
      description: 'Document repository and management'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Application preferences'
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      description: 'Support and documentation'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
                title={item.description}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MenuBar; 