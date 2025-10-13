import React from 'react';
import { Home, Building2, KeyRound, MapPin } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  fullScreen = true
}) => {
  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0' : 'relative min-h-[400px]'}
        flex items-center justify-center
        bg-gradient-to-br from-blue-50 via-white to-blue-50
        z-50
      `}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Real Estate Icons */}
        <div className="relative w-32 h-32">
          {/* Center House Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Home className="w-16 h-16 text-blue-600 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <KeyRound className="w-6 h-6 text-blue-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Orbiting Icons */}
          <div className="absolute inset-0 animate-spin-slow">
            <Building2
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-blue-400"
              style={{ animationDelay: '0s' }}
            />
          </div>

          <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
            <MapPin
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 text-blue-400"
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{message}</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-progress"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
