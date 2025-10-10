import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, TrendingUp, Calendar, Clock, MapPin, Users, Send, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AgentHeader } from '../../components/common';
import {Footer} from '../../components/common/Footer/Footer';
import './AgentDashboard.css';

interface Lead {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
}

interface ScheduledVisit {
  id: number;
  title: string;
  visit_date: string;
  start_time: string;
  end_time: string;
  location: string;
  lead?: Lead;
  property?: Property;
  lead_id?: number;
  property_id?: number;
}

interface ScheduleFormData {
  lead_id: string;
  property_id: string;
  visit_date: string;
  start_time: string;
  end_time: string;
  location: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);
  const [stats, setStats] = useState({
    new_leads: 0,
    total_leads: 0,
    offers_made: 0,
    deals_closed: 0
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingVisits, setIsLoadingVisits] = useState(true);
  
  // Form state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState<ScheduleFormData>({
    lead_id: '',
    property_id: '',
    visit_date: '',
    start_time: '',
    end_time: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteVisit = async (visitId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/leads/visits/${visitId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setScheduledVisits(scheduledVisits.filter(visit => visit.id !== visitId));
      }
    } catch (error) {
      console.error('Error deleting visit:', error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-populate location when property is selected
    if (name === 'property_id' && value) {
      const selectedProperty = properties.find(p => p.id === parseInt(value));
      if (selectedProperty) {
        setFormData(prev => ({
          ...prev,
          location: `${selectedProperty.address}, ${selectedProperty.city}`
        }));
      }
    }
  };
  
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lead_id || !formData.property_id || !formData.visit_date || !formData.start_time || !formData.end_time) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/leads/visits/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        // Refresh visits list
        const visitsResponse = await fetch('http://localhost:8000/api/leads/visits/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (visitsResponse.ok) {
          const visitsData = await visitsResponse.json();
          if (visitsData.results && Array.isArray(visitsData.results)) {
            setScheduledVisits(visitsData.results);
          }
        }
        
        // Reset form
        setFormData({
          lead_id: '',
          property_id: '',
          visit_date: '',
          start_time: '',
          end_time: '',
          location: ''
        });
        
        alert('Visit scheduled successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to schedule visit'}`);
      }
    } catch (error) {
      console.error('Error scheduling visit:', error);
      alert('Failed to schedule visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancelForm = () => {
    setFormData({
      lead_id: '',
      property_id: '',
      visit_date: '',
      start_time: '',
      end_time: '',
      location: ''
    });
  };
  
  // Fetch dashboard data
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (isLoading || !user) return;
    
    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }
        
        const response = await fetch('http://localhost:8000/api/leads/agent/dashboard-stats/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            navigate('/login', { replace: true });
            return;
          }
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        // Update stats
        setStats({
          new_leads: data.new_leads || 0,
          total_leads: data.total_leads || 0,
          offers_made: data.offers_made || 0,
          deals_closed: data.deals_closed || 0
        });
        
        // Fetch scheduled visits
        const visitsResponse = await fetch('http://localhost:8000/api/leads/visits/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (visitsResponse.ok) {
          const visitsData = await visitsResponse.json();
          if (visitsData.results && Array.isArray(visitsData.results)) {
            setScheduledVisits(visitsData.results);
          }
        }
        
        // Fetch leads for dropdown
        const leadsResponse = await fetch('http://localhost:8000/api/leads/list/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json();
          if (leadsData.results && Array.isArray(leadsData.results)) {
            setLeads(leadsData.results.map((lead: any) => ({
              id: lead.id,
              name: `${lead.first_name} ${lead.last_name}`,
              first_name: lead.first_name,
              last_name: lead.last_name,
              email: lead.email,
              phone: lead.phone
            })));
          }
        }
        
        // Fetch properties for dropdown
        const propertiesResponse = await fetch('http://localhost:8000/api/properties/list/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          if (propertiesData.results && Array.isArray(propertiesData.results)) {
            setProperties(propertiesData.results);
          }
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoadingData(false);
        setIsLoadingVisits(false);
      }
    };
    
    fetchDashboardData();
  }, [user, isLoading, navigate]);

  return (
    <div className="agent-dashboard-container">
      <AgentHeader />

      <div className="agent-dashboard-hero">
        <div className="agent-hero-content">
          <div className="agent-hero-text">
            <h1>
              Good Afternoon <span className="agent-sun-icon">☀️</span>
            </h1>
            <div className="agent-name-highlight">{user?.first_name || 'Agent'}</div>
            <p>
              Here is <span className="agent-highlight-text">your</span> weekly overview <span className="agent-highlight-text">report</span>
            </p>
          </div>
          <div className="agent-hero-illustration">
            <img src="/illustration.svg" alt="Dashboard illustration" />
          </div>
        </div>
      </div>

      <div className="agent-main-grid">
        <div className="agent-left-column">
          <div className="agent-stats-grid">
            <div className="agent-stat-card agent-beige">
              <div className="agent-stat-header">New Leads</div>
              <div className="agent-stat-value">
                {isLoadingData ? '...' : stats.new_leads}
              </div>
              <div className="agent-stat-subtext">This Month</div>
            </div>

            <div className="agent-stat-card agent-yellow">
              <div className="agent-stat-header">Offers Made</div>
              <div className="agent-stat-value">
                {isLoadingData ? '...' : stats.offers_made}
              </div>
              <div className="agent-stat-subtext">Active</div>
            </div>

            <div className="agent-stat-card agent-green">
              <div className="agent-stat-header">Deals Closed</div>
              <div className="agent-stat-value">
                {isLoadingData ? '...' : stats.deals_closed}
              </div>
              <div className="agent-stat-subtext">This Month</div>
              <svg className="agent-trend-chart" viewBox="0 0 200 50">
                <path
                  d="M 0,30 L 50,35 L 100,25 L 150,20 L 200,15"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <div className="agent-leads-section">
            <div className="agent-section-header">
              <h2 className="agent-section-title">
                Scheduled Visits
                <span className="agent-manage-badge" onClick={() => navigate('/agent/leads')} style={{ cursor: 'pointer' }}>
                  View Leads
                </span>
              </h2>
            </div>

            <div className="agent-visits-container">
              {isLoadingVisits ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  Loading visits...
                </div>
              ) : scheduledVisits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  No scheduled visits yet.
                </div>
              ) : (
                <div className="agent-visits-grid">
                  {scheduledVisits.map(visit => (
                    <div key={visit.id} className="agent-visit-card">
                      <div className="agent-visit-header">
                        <h3 className="agent-visit-title">{visit.title}</h3>
                        <button 
                          className="agent-visit-delete"
                          onClick={() => handleDeleteVisit(visit.id)}
                          title="Delete visit"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="agent-visit-details">
                        {visit.lead && (
                          <div className="agent-visit-detail">
                            <Users size={14} />
                            <span>{visit.lead.name}</span>
                          </div>
                        )}
                        {visit.property && (
                          <div className="agent-visit-detail">
                            <TrendingUp size={14} />
                            <span>{visit.property.title}</span>
                          </div>
                        )}
                        <div className="agent-visit-detail">
                          <Calendar size={14} />
                          <span>{new Date(visit.visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="agent-visit-detail">
                          <Clock size={14} />
                          <span>{visit.start_time} - {visit.end_time}</span>
                        </div>
                        {visit.location && (
                          <div className="agent-visit-detail">
                            <MapPin size={14} />
                            <span>{visit.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="agent-schedule-section-compact">
          <h3 className="agent-schedule-header">Schedule New Visit</h3>

          <form onSubmit={handleScheduleSubmit} className="agent-schedule-form">
            <div className="agent-form-group">
              <label className="agent-form-label">
                <Users size={16} />
                Select Lead *
              </label>
              <select 
                name="lead_id" 
                value={formData.lead_id} 
                onChange={handleFormChange}
                className="agent-form-select"
                required
              >
                <option value="">Choose a lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} - {lead.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">
                <TrendingUp size={16} />
                Select Property *
              </label>
              <select 
                name="property_id" 
                value={formData.property_id} 
                onChange={handleFormChange}
                className="agent-form-select"
                required
              >
                <option value="">Choose a property...</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">
                <Calendar size={16} />
                Visit Date *
              </label>
              <input 
                type="date" 
                name="visit_date"
                value={formData.visit_date}
                onChange={handleFormChange}
                className="agent-form-input"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="agent-form-row">
              <div className="agent-form-group">
                <label className="agent-form-label">
                  <Clock size={16} />
                  Start Time *
                </label>
                <input 
                  type="time" 
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleFormChange}
                  className="agent-form-input"
                  required
                />
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">
                  <Clock size={16} />
                  End Time *
                </label>
                <input 
                  type="time" 
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleFormChange}
                  className="agent-form-input"
                  required
                />
              </div>
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">
                <MapPin size={16} />
                Location
              </label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Auto-filled from property or enter custom location"
                className="agent-form-input"
              />
            </div>

            <div className="agent-schedule-actions">
              <button 
                type="button" 
                className="agent-cancel-btn"
                onClick={handleCancelForm}
                disabled={isSubmitting}
              >
                Clear
              </button>
              <button 
                type="submit" 
                className="agent-save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Visit'}
              </button>
            </div>
          </form>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default Dashboard;
