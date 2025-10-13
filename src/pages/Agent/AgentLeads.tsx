import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadForm from '../Admin/AddLeadForm';
import Modal from '../Admin/Modal';
import LeadDetailSidebar from '../Admin/LeadDetailSidebar';
import { Filter, Plus, Search, ChevronDown } from 'lucide-react';
import { AgentHeader } from '../../components/common';
import { Footer } from '../../components/common/Footer/Footer';
import { PageLoader } from '../../components/common/Loader';
import './AgentLeads.css';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  budget: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  assigned_agent: string;
  created_by?: string;
}

const AgentLeads: React.FC = () => {
  const location = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [initialLeadData, setInitialLeadData] = useState<any>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found');
        window.location.href = '/login';
        return;
      }
      
      const res = await fetch('http://localhost:8000/api/leads/list/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('Unauthorized - redirecting to login');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const leadsArr = Array.isArray(data.results) ? data.results : [];
      setLeads(
        leadsArr.map((lead: any) => ({
          id: lead.id,
          name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          phone: lead.phone,
          budget: lead.budget_min && lead.budget_max 
            ? `$${Number(lead.budget_min).toLocaleString()} - $${Number(lead.budget_max).toLocaleString()}`
            : 'Not specified',
          status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
          assigned_agent: lead.assigned_to?.user?.first_name 
            ? `${lead.assigned_to.user.first_name} ${lead.assigned_to.user.last_name || ''}`
            : lead.assigned_to?.user?.username || 'Unassigned',
          created_by: lead.created_by?.first_name
            ? `${lead.created_by.first_name} ${lead.created_by.last_name || ''}`
            : lead.created_by?.username || 'Unknown',
        }))
      );
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      // Ensure loader shows for at least 1 second
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle navigation from notification
  useEffect(() => {
    if (location.state) {
      // If notification wants to open existing lead detail
      if (location.state.openLeadId) {
        setSelectedLeadId(location.state.openLeadId);
        // Clear the state to prevent reopening on refresh
        window.history.replaceState({}, document.title);
      }
      // Legacy: if notification wants to open add lead form (kept for backward compatibility)
      else if (location.state.openAddLead) {
        setInitialLeadData(location.state.leadData || null);
        setShowAddForm(true);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const handleSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = React.useMemo(() => {
    const sortableLeads = [...leads];
    if (sortConfig.key !== null) {
      const key = sortConfig.key;
      sortableLeads.sort((a, b) => {
        const aValue = a[key] ?? '';
        const bValue = b[key] ?? '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  const filteredLeads = sortedLeads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.assigned_agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFiltersClick = () => {
    console.log('Filters clicked');
  };

  const handleAddLeadClick = () => {
    setInitialLeadData(null); // Clear any previous data
    setShowAddForm(true);
  };

  const handleLeadAdded = () => {
    setShowAddForm(false);
    setInitialLeadData(null); // Clear the initial data
    fetchLeads();
  };

  const handleLeadClick = (leadId: number) => {
    setSelectedLeadId(leadId);
  };

  const handleCloseSidebar = () => {
    setSelectedLeadId(null);
  };

  const handleLeadUpdated = () => {
    fetchLeads();
  };

  if (isLoading) {
    return <PageLoader message="Loading Your Leads..." fullScreen={true} />;
  }

  return (
    <div className="agent-leads-container">
      <AgentHeader />

      <main className="agent-leads-main">
        <div className="agent-leads-content">
          <h1 className="agent-leads-title">
            My <span className="title-highlight">Leads</span>
          </h1>
          <p className="agent-leads-subtitle">
            Manage leads assigned to you or created by you
          </p>

          <div className="agent-leads-actions">
            <button className="filters-btn" onClick={handleFiltersClick}>
              <Filter size={18} />
              Filters
            </button>
            <button className="add-lead-btn" onClick={handleAddLeadClick}>
              <Plus size={18} />
              Add Lead
            </button>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <Search size={18} />
              </button>
            </form>
          </div>

          {showAddForm && (
            <Modal onClose={() => {
              setShowAddForm(false);
              setInitialLeadData(null);
            }}>
              <AddLeadForm 
                onLeadAdded={handleLeadAdded}
                onClose={() => {
                  setShowAddForm(false);
                  setInitialLeadData(null);
                }}
                initialData={initialLeadData}
              />
            </Modal>
          )}

          {isLoading ? (
            <div className="loading-state">
              <p>Loading your leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="empty-state">
              <p>No leads found. {leads.length === 0 ? 'Create your first lead!' : 'Try adjusting your search.'}</p>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="agent-leads-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')}>
                        <div className="th-content">
                          Name
                          <ChevronDown size={16} className="sort-icon" />
                        </div>
                      </th>
                      <th onClick={() => handleSort('email')}>
                        <div className="th-content">
                          Email
                          <ChevronDown size={16} className="sort-icon" />
                        </div>
                      </th>
                      <th onClick={() => handleSort('phone')}>
                        <div className="th-content">
                          Phone
                          <ChevronDown size={16} className="sort-icon" />
                        </div>
                      </th>
                      <th onClick={() => handleSort('budget')}>
                        <div className="th-content">
                          Budget
                          <ChevronDown size={16} className="sort-icon" />
                        </div>
                      </th>
                      <th onClick={() => handleSort('status')}>
                        <div className="th-content">
                          Status
                          <ChevronDown size={16} className="sort-icon" />
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          Assigned To
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} onClick={() => handleLeadClick(lead.id)} style={{ cursor: 'pointer' }}>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.budget}</td>
                        <td>
                          <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td>{lead.assigned_agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leads.length > 10 && (
                <div className="pagination">
                  <button
                    className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                  <button
                    className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </button>
                  <button
                    className={`page-btn ${currentPage === 3 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(3)}
                  >
                    3
                  </button>
                  <button
                    className={`page-btn ${currentPage === 4 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(4)}
                  >
                    4
                  </button>
                </div>
              )}
            </>
          )}

          {selectedLeadId && (
            <LeadDetailSidebar
              leadId={selectedLeadId}
              onClose={handleCloseSidebar}
              onUpdate={handleLeadUpdated}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgentLeads;
