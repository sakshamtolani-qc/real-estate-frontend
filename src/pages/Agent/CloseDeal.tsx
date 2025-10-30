import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '../../components/common/AgentHeader/AgentHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { PageLoader } from '../../components/common/Loader';
import './CloseDeal.css';

interface Deal {
  id: number;
  title: string;
  closingDate: string;
  image: string;
}

const CloseDeal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const deals: Deal[] = [
    {
      id: 1,
      title: 'Lorem Ipsum',
      closingDate: '5 Sept 2025',
      image: '/property-1.jpg'
    },
    {
      id: 2,
      title: 'Flat with 3 Rooms',
      closingDate: '12 Sept 2025',
      image: '/property-2.jpg'
    },
    {
      id: 3,
      title: 'Lorem Ipsum',
      closingDate: '5 Sept 2025',
      image: '/property-3.jpg'
    },
    {
      id: 4,
      title: 'Flat with 3 Rooms',
      closingDate: '12 Sept 2025',
      image: '/property-4.jpg'
    },
    {
      id: 5,
      title: 'Lorem Ipsum',
      closingDate: '5 Sept 2025',
      image: '/property-5.jpg'
    },
    {
      id: 6,
      title: 'Flat with 3 Rooms',
      closingDate: '12 Sept 2025',
      image: '/property-6.jpg'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
    console.log('Filters toggled');
  };

  const handleDetailsClick = (dealId: number) => {
    console.log('Navigating to deal details:', dealId);
    window.location.href = `/deal/${dealId}`;
  };

  if (isLoading) {
    return <PageLoader message="Loading Closed Deals..." fullScreen={true} />;
  }

  return (
    <div className="deal-page">
      <Header />

      <main className="deal-main">
        <div className="deal-hero">
          <h1 className="deal-title">
            Deals <span className="deal-title-highlight">Closed</span>
          </h1>
        </div>

        <div className="deal-controls">
          <button
            className="deal-filter-btn"
            onClick={handleFilterClick}
            aria-label="Open filters"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <form onSubmit={handleSearch} className="deal-search-form">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="deal-search-input"
            />
            <button
              type="submit"
              className="deal-search-btn"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="deal-content">
          <h2 className="deal-section-title">
            This <span className="deal-section-highlight">Quatre</span>
          </h2>

          <div className="deal-list">
            {deals.map((deal) => (
              <div key={deal.id} className="deal-item">
                <div className="deal-item-content">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="deal-item-image"
                  />
                  <div className="deal-item-info">
                    <h3 className="deal-item-title">{deal.title}</h3>
                    <p className="deal-item-date">
                      Closing Date: <span className="deal-date-value">{deal.closingDate}</span>
                    </p>
                  </div>
                </div>
                <button
                  className="deal-details-btn"
                  onClick={() => handleDetailsClick(deal.id)}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        
      </main>

      <Footer />
    </div>
  );
};

export default CloseDeal;
