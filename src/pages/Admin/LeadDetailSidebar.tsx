import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, User, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import CloseLeadForm from './CloseLeadForm';
import './LeadDetailSidebar.css';

interface Agent {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface NoteHistory {
  id: number;
  note: string;
  created_at: string;
  created_by: string;
}

interface LeadDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
  notes_history: NoteHistory[];
  follow_up_date: string | null;
  assigned_to: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      username: string;
    };
  } | null;
}

interface LeadDetailSidebarProps {
  leadId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'closed', label: 'Closed' },
  { value: 'lost', label: 'Lost' },
];

const LeadDetailSidebar: React.FC<LeadDetailSidebarProps> = ({ leadId, onClose, onUpdate }) => {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCloseDealForm, setShowCloseDealForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: 'new',
    notes: '',
    follow_up_date: '',
    assigned_to: '',
  });
  const [notesHistory, setNotesHistory] = useState<NoteHistory[]>([]);

  const fetchLeadDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/leads/${leadId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setLead(data);
      setNotesHistory(data.notes_history || []);
      
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        notes: '',  // Clear notes field for new note entry
        follow_up_date: data.follow_up_date || '',
        assigned_to: data.assigned_to?.id?.toString() || '',
      });
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [leadId]);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/leads/agents/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setAgents(data.results || []);
    } catch (err) {
      // Failed to fetch agents
    }
  };

  useEffect(() => {
    // Check if user is admin
    try {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user.is_superuser || user.is_staff || false);
      }
    } catch (err) {
      // Failed to parse user data
    }
    
    fetchLeadDetails();
    fetchAgents();
    
    // Scroll to top when sidebar opens - use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const formSection = document.querySelector('.form-section');
      if (formSection) {
        formSection.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      }
    }, 50);
    
    // Additional scroll reset after animation completes
    setTimeout(() => {
      const formSection = document.querySelector('.form-section');
      if (formSection) {
        formSection.scrollTop = 0;
      }
    }, 350);
  }, [leadId, fetchLeadDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/leads/${leadId}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        }),
      });

      if (res.ok) {
        toast.success('Lead updated successfully!');
        // Clear the notes field after successful submission
        setFormData(prev => ({ ...prev, notes: '' }));
        // Refresh lead details to get updated notes history
        await fetchLeadDetails();
        onUpdate();
      } else {
        toast.error('Failed to update lead. Please try again.');
      }
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/leads/${leadId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success('Lead deleted successfully!');
        // Close the sidebar and refresh the list
        onClose();
        onUpdate();
      } else {
        toast.error('Failed to delete lead. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred while deleting the lead.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleCloseDealSuccess = () => {
    // Refresh lead details and trigger parent update
    fetchLeadDetails();
    onUpdate();
  };

  if (loading) {
    return (
      <div className="sidebar-overlay">
        <div className="sidebar-container">
          <div className="sidebar-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            Lead <span className="title-highlight">Details</span>
          </h2>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form className="sidebar-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Mobile Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="assigned_to">
                  {/* <User size={16} className="label-icon" /> */}
                  Assigned Agent
                </label>
                {isAdmin ? (
                  <select
                    id="assigned_to"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleInputChange}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.full_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={
                      lead?.assigned_to
                        ? `${lead.assigned_to.user.first_name} ${lead.assigned_to.user.last_name || ''}`.trim() || lead.assigned_to.user.username
                        : 'Unassigned'
                    }
                    disabled
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="follow_up_date">
                  {/* <Calendar size={16} className="label-icon" /> */}
                  Follow-up Date
                </label>
                <input
                  type="date"
                  id="follow_up_date"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Add New Note</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Type your note here and click Update to save..."
                />
              </div>

              {notesHistory.length > 0 && (
                <div className="form-group full-width">
                  <label>Notes History</label>
                  <div className="notes-history">
                    {notesHistory.map((note) => (
                      <div key={note.id} className="note-item">
                        <div className="note-header">
                          <span className="note-author">{note.created_by}</span>
                          <span className="note-date">
                            {new Date(note.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="note-content">{note.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-actions">
            <div className="sidebar-actions-left">
              {formData.status === 'won' && (
                <button 
                  type="button" 
                  className="btn-close-deal" 
                  onClick={() => setShowCloseDealForm(true)}
                  disabled={saving || deleting}
                >
                  <CheckCircle size={16} />
                  Close Deal
                </button>
              )}
              <button 
                type="button" 
                className="btn-delete" 
                onClick={handleDeleteClick}
                disabled={saving || deleting}
              >
                <Trash2 size={16} />
                Delete Lead
              </button>
            </div>
            <div className="sidebar-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-update" disabled={saving || deleting}>
                {saving ? 'Updating...' : 'Update Lead'}
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="delete-confirm-overlay" onClick={handleDeleteCancel}>
            <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Delete</h3>
              <p>
                Are you sure you want to delete this lead? 
                <br />
                <strong>{formData.first_name} {formData.last_name}</strong>
                <br />
                This action cannot be undone.
              </p>
              <div className="delete-confirm-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-delete-confirm" 
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCloseDealForm && (
          <CloseLeadForm
            leadId={lead?.id || leadId}
            firstName={formData.first_name}
            lastName={formData.last_name}
            onClose={() => setShowCloseDealForm(false)}
            onSuccess={handleCloseDealSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default LeadDetailSidebar;
