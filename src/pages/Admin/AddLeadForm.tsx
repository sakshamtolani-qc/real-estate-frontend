import React, { useState, useEffect } from 'react';
import { toast } from '../../utils';

interface AddLeadFormProps {
  onLeadAdded: () => void;
}

interface Agent {
  id: number;
  name: string;
}

const AddLeadForm: React.FC<AddLeadFormProps> = ({ onLeadAdded }) => {
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

  useEffect(() => {
    // Fetch agents for assignment dropdown
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('http://localhost:8000/api/accounts/list/', {
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
        console.error('Failed to fetch agents', err);
      }
    };
    fetchAgents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/leads/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          budget_min: budgetMin ? parseFloat(budgetMin) : null,
          budget_max: budgetMax ? parseFloat(budgetMax) : null,
          status,
          assigned_to: assignedAgent || null,
        }),
      });

      if (response.ok) {
        toast.success('Lead added successfully!');
        onLeadAdded();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('An error occurred while adding lead');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-staff-form">
      <h2 className="form-title">Add New Lead</h2>
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
        </div>

        <div className="form-actions">
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
