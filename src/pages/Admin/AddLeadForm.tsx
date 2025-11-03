import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from '../../utils';

interface AddLeadFormProps {
  onLeadAdded: () => void;
  onClose?: () => void;
  initialData?: any;
}

interface Agent {
  id: number;
  name: string;
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({ onLeadAdded, onClose, initialData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [status, setStatus] = useState('new');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize form with notification data if provided
  useEffect(() => {
    if (initialData) {
      const firstName = initialData.lead_name ? initialData.lead_name.split(' ')[0] : '';
      const lastName = initialData.lead_name ? initialData.lead_name.split(' ').slice(1).join(' ') : '';
      
      setFirstName(firstName || '');
      setLastName(lastName || '');
      setEmail(initialData.lead_email || '');
      setPhone(initialData.lead_phone || '');
      setBudgetMin(initialData.budget_min || '');
      setBudgetMax(initialData.budget_max || '');
      setStatus('new'); // Default status for new leads from notifications
    }
  }, [initialData]);

  useEffect(() => {
    // Check if user is admin
    const checkUserRole = () => {
      try {
        const userStr = localStorage.getItem('auth_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setIsAdmin(user.is_superuser || user.is_staff || false);
        }
      } catch (err) {
        // Failed to parse user data
      }
    };
    
    // Fetch agents for assignment dropdown (only for admins)
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/accounts/list/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        const agentsArr = Array.isArray(data.results) ? data.results : [];
        setAgents(
          agentsArr.map((emp: any) => ({
            id: emp.id,
            name: (emp.user.first_name && emp.user.first_name.length > 0) 
              ? `${emp.user.first_name} ${emp.user.last_name || ''}` 
              : emp.user.username
          }))
        );
      } catch (err) {
        // Failed to fetch agents
      }
    };
    
    checkUserRole();
    
    // Only fetch agents if user is admin
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.is_superuser || user.is_staff) {
          fetchAgents();
        }
      } catch (err) {
        // Failed to parse user data
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      // Prepare request body
      const requestBody: any = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        budget_min: budgetMin ? parseFloat(budgetMin) : null,
        budget_max: budgetMax ? parseFloat(budgetMax) : null,
        status,
      };
      
      // Only include assigned_to if user is admin and an agent was selected
      if (isAdmin && assignedAgent) {
        requestBody.assigned_to = assignedAgent;
      }
      
      const response = await fetch('/api/leads/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message
        toast.success(data.message || 'Lead added successfully!');
        
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setBudgetMin('');
        setBudgetMax('');
        setStatus('new');
        setAssignedAgent('');
        
        // Call parent callback to refresh list
        onLeadAdded();
      } else {
        // Show error message from backend
        toast.error(data.message || 'Failed to add lead');
        
        // If duplicate lead, existing_lead_id can be used by the backend
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-staff-form">
      <div className="form-header">
        <h2 className="form-title">Add New Lead</h2>
        {onClose && (
          <button 
            type="button" 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter first name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="budgetMin">Min Budget ($)</label>
            <input
              type="number"
              id="budgetMin"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="50000"
              min="0"
              step="1000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="budgetMax">Max Budget ($)</label>
            <input
              type="number"
              id="budgetMax"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="200000"
              min="0"
              step="1000"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          {isAdmin && (
            <div className="form-group">
              <label htmlFor="assignedAgent">Assign Agent</label>
              <select
                id="assignedAgent"
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
              >
                <option value="">-- Select Agent --</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!isAdmin && (
            <div className="form-group">
              <label>Assignment</label>
              <p style={{ margin: '10px 0', color: '#666', fontSize: '14px' }}>
                This lead will be automatically assigned to you
              </p>
            </div>
          )}
        </div>

        <div className="form-actions">
          {onClose && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadForm;
