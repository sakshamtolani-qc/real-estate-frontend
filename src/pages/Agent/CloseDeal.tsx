import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '../../components/common/AgentHeader/AgentHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { PageLoader } from '../../components/common/Loader';
import './CloseDeal.css';

interface Deal {
  id: number;
  property_title: string;
  closing_date: string;
  closing_amount: string;
  offer_amount?: string;
  lead_name: string;
  property_image?: string;
}

const CloseDeal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    // Filter deals based on search query
    if (searchQuery.trim() === '') {
      setFilteredDeals(deals);
    } else {
      const filtered = deals.filter((deal) =>
        deal.property_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDeals(filtered);
    }
  }, [searchQuery, deals]);

  const fetchDeals = async () => {
    const startTime = Date.now();
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('/api/leads/deals/closed/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const dealsArray = Array.isArray(data.results) ? data.results : [];
      setDeals(dealsArray);
      setFilteredDeals(dealsArray);
    } catch (err) {
      // Failed to fetch deals
    } finally {
      // Ensure loader shows for at least 1 second
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter is handled by useEffect
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
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
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => (
                <div key={deal.id} className="deal-item">
                  <img
                    src={deal.property_image || '/property-placeholder.jpg'}
                    alt={deal.property_title}
                    className="deal-item-image"
                  />
                  <div className="deal-item-content">
                    <div className="deal-item-main">
                      <h3 className="deal-item-title">{deal.property_title}</h3>
                      <p className="deal-item-lead">
                        <span className="deal-label">Lead:</span> <span className="deal-lead-name">{deal.lead_name}</span>
                      </p>
                    </div>
                    <div className="deal-item-details">
                      <div className="deal-detail-column">
                        <span className="deal-label">Offer Amount:</span>
                        <span className="deal-offer-value">${deal.offer_amount ? parseFloat(deal.offer_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</span>
                      </div>
                      <div className="deal-detail-column">
                        <span className="deal-label">Closing Amount:</span>
                        <span className="deal-amount-value">${parseFloat(deal.closing_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="deal-detail-column">
                        <span className="deal-label">Closing Date:</span>
                        <span className="deal-date-value">{new Date(deal.closing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="deal-no-results">
                <p>No closed deals found.</p>
              </div>
            )}
          </div>
        </div>

        
      </main>

      <Footer />
    </div>
  );
};

export default CloseDeal;
