import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Building, MapPin, Key, TrendingUp, Users } from "lucide-react";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Set document title for SEO and accessibility
    document.title = "404 - Page Not Found";
    
    // Clean up title on unmount
    return () => {
      document.title = "Real Estate CRM"; // Replace with your actual app name
    };
  }, [location.pathname]);

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <article className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-slate-200 max-w-2xl w-full relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        {/* Floating real estate icons */}
        <div className="absolute top-6 right-6 opacity-10">
          <Building className="w-16 h-16 text-blue-500 animate-bounce" style={{animationDelay: '0s'}} />
        </div>
        <div className="absolute top-20 left-8 opacity-10">
          <Home className="w-12 h-12 text-indigo-500 animate-bounce" style={{animationDelay: '1s'}} />
        </div>
        <div className="absolute bottom-20 right-12 opacity-10">
          <Key className="w-10 h-10 text-purple-500 animate-bounce" style={{animationDelay: '2s'}} />
        </div>
        <div className="absolute bottom-32 left-6 opacity-10">
          <MapPin className="w-8 h-8 text-blue-400 animate-bounce" style={{animationDelay: '0.5s'}} />
        </div>
        
        {/* Screen reader announcement */}
        <div className="sr-only">Error 404: Page not found</div>
        
        {/* Animated 404 illustration */}
        <div className="mb-8 relative z-10">
          <div className="relative">
            <div 
              className="text-8xl md:text-[10rem] font-black leading-none mb-4 select-none transform hover:scale-105 transition-transform duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #3B82F6, #6366F1, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              404
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute top-1/2 -left-6 w-3 h-3 bg-indigo-400 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute bottom-4 right-8 w-4 h-4 bg-purple-400 rounded-full opacity-50 animate-bounce"></div>
          </div>
        </div>
        
        <header className="mb-6 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full shadow-lg">
              <Building className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold mb-3 text-slate-800"
          >
            Property Not Found
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </header>
        
        <section className="mb-8 relative z-10">
          <p 
            className="text-lg leading-relaxed mb-6 text-slate-600"
          >
            Looks like this property has been sold or the listing doesn't exist. 
            Our real estate experts are here to help you find the perfect match!
          </p>
          <div 
            className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 text-sm border border-slate-200"
          >
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4 text-slate-500 mr-2" />
              <span className="font-semibold text-slate-700">Requested URL:</span>
            </div>
            <code 
              className="bg-white px-3 py-2 rounded-lg text-xs font-mono border text-slate-700 break-all"
            >
              {location.pathname}
            </code>
          </div>
        </section>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-medium text-blue-700">Growing Market</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
            <Users className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
            <div className="text-xs font-medium text-indigo-700">Expert Agents</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <Home className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-medium text-purple-700">Dream Homes</div>
          </div>
        </div>
        
        <nav aria-label="Error page navigation" className="space-y-4 relative z-10">
          <Link 
            to="/" 
            className="group inline-flex items-center px-8 py-4 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            aria-label="Go back to homepage"
          >
            <Home className="w-5 h-5 mr-3 group-hover:animate-pulse" />
            Return to Dashboard
          </Link>
          
          <div>
            <button 
              onClick={() => window.history.back()} 
              className="group text-base font-medium transition-all duration-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-50"
              aria-label="Go back to previous page"
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">←</span>
              {' '}Go back to previous page
            </button>
          </div>
        </nav>

        {/* Additional helpful links */}
        <footer className="mt-8 pt-6 border-t border-slate-200 relative z-10">
          <p className="text-sm mb-4 font-medium text-slate-600">
            Explore our real estate solutions:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/properties" 
              className="group flex items-center hover:text-blue-600 transition-colors duration-200 text-slate-500"
            >
              <Building className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              Properties
            </Link>
            <span className="text-slate-300">|</span>
            <Link 
              to="/agents" 
              className="group flex items-center hover:text-blue-600 transition-colors duration-200 text-slate-500"
            >
              <Users className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              Our Agents
            </Link>
            <span className="text-slate-300">|</span>
            <Link 
              to="/contact" 
              className="group flex items-center hover:text-blue-600 transition-colors duration-200 text-slate-500"
            >
              <MapPin className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              Contact
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
};

export default NotFoundPage;
