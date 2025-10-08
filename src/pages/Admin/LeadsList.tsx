import React, { useState, useEffect } from 'react';
import AddLeadForm from './AddLeadForm';
import Modal from './Modal';
import LeadDetailSidebar from './LeadDetailSidebar';
import { Filter, Plus, Search, ChevronDown } from 'lucide-react';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const fetchLeads = async () => {
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
        }))
      );
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFiltersClick = () => {
    console.log('Filters clicked');
  };

  const handleAddLeadClick = () => {
    setShowAddForm(true);
  };

  const handleLeadAdded = () => {
    setShowAddForm(false);
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
            <Modal onClose={() => setShowAddForm(false)}>
              <AddLeadForm onLeadAdded={handleLeadAdded} />
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
