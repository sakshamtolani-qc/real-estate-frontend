import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download } from 'lucide-react';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import { Footer } from '../../components/common/Footer/Footer';
import { PageLoader } from '../../components/common/Loader';
import './Reports.css';

interface Deal {
  id: number;
  lead_id: number;
  lead_name: string;
  property_title: string;
  property_image?: string;
  offer_amount?: string;
  closing_amount: string;
  offer_date?: string;
  closing_date: string;
  deal_type: string;
  closed_by: string;
  status: string;
  created_at: string;
}

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [filterAgent, setFilterAgent] = useState('');
  const [filterType, setFilterType] = useState('');
  const [agents, setAgents] = useState<string[]>([]);

  const filterDeals = () => {
    let filtered = deals;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((deal) =>
        deal.property_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterAgent !== '') {
      filtered = filtered.filter((deal) => deal.closed_by === filterAgent);
    }

    if (filterType !== '') {
      filtered = filtered.filter((deal) => deal.deal_type === filterType);
    }

    setFilteredDeals(filtered);
  };

  useEffect(() => {
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, deals, filterAgent, filterType]);

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
      
      // Extract unique agents
      const agentSet = new Set(dealsArray.map((d: Deal) => d.closed_by));
      const uniqueAgents = Array.from(agentSet) as string[];
      setAgents(uniqueAgents);
    } catch (err) {
      console.error('Error fetching deals:', err);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const calculateTotalRevenue = () => {
    return filteredDeals.reduce((sum, deal) => {
      return sum + parseFloat(deal.closing_amount || '0');
    }, 0);
  };

  const downloadReport = () => {
    if (filteredDeals.length === 0) return;

    const data = filteredDeals.map((deal) => ({
      'Lead Name': deal.lead_name,
      'Property': deal.property_title,
      'Deal Type': deal.deal_type,
      'Offer Amount': `₹${parseFloat(deal.offer_amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Closing Amount': `₹${parseFloat(deal.closing_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'Closed By': deal.closed_by,
      'Closing Date': new Date(deal.closing_date).toLocaleDateString('en-IN'),
    }));

    const csv = [
      Object.keys(data[0]),
      ...data.map(row => Object.values(row))
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deals-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return <PageLoader message="Loading Reports..." fullScreen={true} />;
  }

  const totalRevenue = calculateTotalRevenue();

  return (
    <div className="reports-page">
      <AdminHeader />

      <main className="reports-main">
        <div className="reports-hero">
          <h1 className="reports-title">
            Closed Deals <span className="reports-title-highlight">Reports</span>
          </h1>
          <p className="reports-subtitle">View all closed deals and revenue analytics</p>
        </div>

        <div className="reports-controls">
          <button
            className="reports-filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <form onSubmit={handleSearch} className="reports-search-form">
            <input
              type="text"
              placeholder="Search by property or lead name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="reports-search-input"
            />
            <button
              type="submit"
              className="reports-search-btn"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>

          <button
            className="reports-download-btn"
            onClick={downloadReport}
            disabled={filteredDeals.length === 0}
            title="Download report as CSV"
          >
            <Download size={18} />
            <span className="reports-btn-text">Export</span>
          </button>
        </div>

        {showFilters && (
          <div className="reports-filters">
            <div className="filter-group">
              <label className="filter-label">Filter by Agent</label>
              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="filter-select"
              >
                <option value="">All Agents</option>
                {agents.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <button
              className="filter-clear-btn"
              onClick={() => {
                setFilterAgent('');
                setFilterType('');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="reports-stats">
          <div className="reports-stat-card">
            <div className="reports-stat-label">Total Deals</div>
            <div className="reports-stat-value">{filteredDeals.length}</div>
          </div>
          <div className="reports-stat-card highlight">
            <div className="reports-stat-label">Total Revenue</div>
            <div className="reports-stat-value">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="reports-stat-card">
            <div className="reports-stat-label">Average Deal</div>
            <div className="reports-stat-value">
              ₹{filteredDeals.length > 0 ? (totalRevenue / filteredDeals.length).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
            </div>
          </div>
        </div>

        <div className="reports-content">
          <div className="reports-list">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => (
                <div key={deal.id} className="reports-item">
                  {deal.property_image && (
                    <img
                      src={deal.property_image}
                      alt={deal.property_title}
                      className="reports-item-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/property-placeholder.jpg';
                      }}
                    />
                  )}
                  <div className="reports-item-content">
                    <div className="reports-item-main">
                      <h3 className="reports-item-title">{deal.property_title}</h3>
                      <p className="reports-item-lead">
                        <span className="reports-label">Lead:</span>
                        <span className="reports-lead-name">{deal.lead_name}</span>
                      </p>
                    </div>

                    <div className="reports-item-details">
                      <div className="reports-detail-column">
                        <span className="reports-label">Agent</span>
                        <span className="reports-agent-name">{deal.closed_by}</span>
                      </div>
                      <div className="reports-detail-column">
                        <span className="reports-label">Offer Amount</span>
                        <span className="reports-amount">
                          ₹{deal.offer_amount ? parseFloat(deal.offer_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
                        </span>
                      </div>
                      <div className="reports-detail-column">
                        <span className="reports-label">Closing Amount</span>
                        <span className="reports-amount-highlight">
                          ₹{parseFloat(deal.closing_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="reports-detail-column">
                        <span className="reports-label">Type</span>
                        <span className="reports-deal-type">{deal.deal_type.charAt(0).toUpperCase() + deal.deal_type.slice(1)}</span>
                      </div>
                      <div className="reports-detail-column">
                        <span className="reports-label">Closing Date</span>
                        <span className="reports-date">
                          {new Date(deal.closing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="reports-no-results">
                <p>No closed deals found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
