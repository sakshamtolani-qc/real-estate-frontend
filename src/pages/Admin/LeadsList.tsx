import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadForm from './AddLeadForm';
import Modal from './Modal';
import LeadDetailSidebar from './LeadDetailSidebar';
import { Filter, Plus, Search, ChevronDown } from 'lucide-react';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { PageLoader } from '../../components/common/Loader';
import './LeadsList.css';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  budget: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  assigned_agent: string;
}

const LeadsList: React.FC = () => {
  const location = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [initialLeadData, setInitialLeadData] = useState<any>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  const itemsPerPage = 10;

  const fetchLeads = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      const res = await fetch('/api/leads/list/', {
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
        }))
      );
    } catch (err) {
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
    
    // Set up polling to refresh leads every 30 seconds
    const interval = setInterval(() => {
      fetchLeads();
    }, 30000);
    
    return () => clearInterval(interval);
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
      sortableLeads.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
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
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
  
  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredLeads.length, totalPages, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFiltersClick = () => {
    // Filters functionality to be implemented
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
    // Refresh leads when sidebar closes in case something was updated
    fetchLeads();
  };

  const handleLeadUpdated = () => {
    fetchLeads();
  };

  if (isLoading) {
    return <PageLoader message="Loading Leads..." fullScreen={true} />;
  }

  return (
    <div className="leads-list-container">
      <AdminHeader />

      <main className="leads-list-main">
        <div className="leads-list-content">
          <h1 className="leads-list-title">
            Leads <span className="title-highlight">List</span>
          </h1>

          <div className="leads-list-actions">
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
                placeholder="Search"
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

          <div className="table-wrapper">
            <table className="leads-table">
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
                  <th onClick={() => handleSort('assigned_agent')}>
                    <div className="th-content">
                      Assigned Agent
                      <ChevronDown size={16} className="sort-icon" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => (
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

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

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

export default LeadsList;
