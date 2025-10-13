import React from 'react';
import { Search, Home, MapPin, DollarSign } from 'lucide-react';

interface SearchLoaderProps {
  message?: string;
  inline?: boolean;
}

const SearchLoader: React.FC<SearchLoaderProps> = ({
  message = 'Searching properties...',
  inline = false
}) => {
  if (inline) {
    return (
      <div className="flex items-center space-x-3 py-4">
        <Search className="w-5 h-5 text-blue-600 animate-pulse" />
        <span className="text-gray-600 text-sm">{message}</span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Animated Search Icon with Property Icons */}
      <div className="relative w-24 h-24">
        {/* Main Search Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-12 h-12 text-blue-600 animate-pulse" />
        </div>

        {/* Floating Property Icons */}
        <div className="absolute inset-0">
          <Home
            className="absolute top-0 left-0 w-6 h-6 text-blue-400 animate-float"
            style={{ animationDelay: '0s' }}
          />
          <MapPin
            className="absolute top-0 right-0 w-6 h-6 text-green-400 animate-float"
            style={{ animationDelay: '0.3s' }}
          />
          <DollarSign
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400 animate-float"
            style={{ animationDelay: '0.6s' }}
          />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-gray-700 font-medium">{message}</p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Search Progress */}
      <div className="w-48 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Searching...</span>
          <span className="animate-pulse">●</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-search-progress"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes search-progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-search-progress {
          animation: search-progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SearchLoader;
