import React, { useState } from 'react';
import { Search, Filter, Plus, TrendingUp, Calendar, Clock, MapPin, Users, Send, X } from 'lucide-react';
import Header from '../../components/common/Header/Header';
import {Footer} from '../../components/common/Footer/Footer';
import './AgentDashboard.css';

interface Lead {
  id: string;
  name: string;
  phone: string;
  notInterested: boolean;
  interested: boolean;
}

interface MeetingSlot {
  id: string;
  title: string;
  date: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Lorem Ipsum', phone: '09203XXXX', notInterested: false, interested: false },
    { id: '2', name: 'Lorem Ipsum', phone: '09203XXXX', notInterested: false, interested: false },
    { id: '3', name: 'Lorem Ipsum', phone: '09203XXXX', notInterested: false, interested: false },
    { id: '4', name: 'Lorem Ipsum', phone: '09203XXXX', notInterested: false, interested: false },
    { id: '5', name: 'Lorem Ipsum', phone: '09203XXXX', notInterested: false, interested: false },
  ]);

  const [meetingSlots] = useState<MeetingSlot[]>([
    { id: '1', title: 'Free slot 1', date: '19 October 2025', time: '3:00 PM - 10:00 PM' },
    { id: '2', title: 'Free slot 2', date: '20 October 2025', time: '9:00 PM - 10:00 PM' },
  ]);

  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(['S']);
  const [isRepeating, setIsRepeating] = useState(false);
  const weekdays = ['On', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleCheckboxChange = (id: string, field: 'notInterested' | 'interested') => {
    setLeads(leads.map(lead =>
      lead.id === id ? { ...lead, [field]: !lead[field] } : lead
    ));
  };

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="agent-dashboard-container">
      <Header />

      <div className="agent-dashboard-hero">
        <div className="agent-hero-content">
          <div className="agent-hero-text">
            <h1>
              Good Afternoon <span className="agent-sun-icon">☀️</span>
            </h1>
            <div className="agent-name-highlight">First_Name</div>
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
              <div className="agent-stat-value">300</div>
            </div>

            <div className="agent-stat-card agent-yellow">
              <div className="agent-stat-header">Offers Made</div>
              <div className="agent-stat-value">3.4k</div>
            </div>

            <div className="agent-stat-card agent-green">
              <div className="agent-stat-header">Deals Closed</div>
              <div className="agent-stat-value">
                103 
                <span className="agent-stat-trend">
                  <TrendingUp size={14} /> 12.5%
                </span>
              </div>
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
                Leads
                <span className="agent-manage-badge">Manage Lead</span>
              </h2>
            </div>

            <div className="agent-table-controls">
              <button className="agent-filter-btn">
                <Filter size={16} />
                Filters
              </button>
              <button className="agent-add-btn">
                <Plus size={16} />
                Add Lead
              </button>
              <div className="agent-search-box">
                <input type="text" placeholder="Search" />
                <Search size={16} className="agent-search-icon" />
              </div>
            </div>

            <table className="agent-leads-table">
              <thead>
                <tr>
                  <th>Name ▼</th>
                  <th>Phone No. ▼</th>
                  <th>Not Interested</th>
                  <th>Interested</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={lead.notInterested}
                        onChange={() => handleCheckboxChange(lead.id, 'notInterested')}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={lead.interested}
                        onChange={() => handleCheckboxChange(lead.id, 'interested')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="agent-schedule-section-compact">
          <h3 className="agent-schedule-header">Schedule Visits</h3>

          <div className="agent-meeting-item">
            <div className="agent-meeting-heading">Meeting heading...</div>
            <div className="agent-meeting-slots">
              {meetingSlots.map(slot => (
                <div key={slot.id} className="agent-slot">
                  <div className="agent-slot-header">
                    <div className="agent-slot-title">{slot.title}</div>
                    <button className="agent-slot-close"><X size={14} /></button>
                  </div>
                  <div className="agent-slot-date">
                    <Calendar size={12} />
                    {slot.date}
                  </div>
                  <div className="agent-slot-time">
                    <Clock size={12} />
                    {slot.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="agent-datetime-selector">
            <div className="agent-datetime-label">
              <Clock size={16} />
              Date & Time
            </div>
            <div className="agent-datetime-inputs">
              <input type="date" defaultValue="2025-10-19" />
              <select defaultValue="indian">
                <option value="indian">Indian Timezone</option>
              </select>
            </div>
            <div className="agent-datetime-inputs">
              <input type="text" placeholder="Choose date" />
              <select defaultValue="indian">
                <option value="indian">Indian Timezone</option>
              </select>
            </div>
          </div>

          <div className="agent-location-input">
            <div className="agent-datetime-label">
              <MapPin size={16} />
              Choose location
            </div>
            <input type="text" placeholder="Choose location" />
          </div>

          <div className="agent-participants-input">
            <div className="agent-datetime-label">
              <Users size={16} />
              Add participants
            </div>
            <div className="agent-participants-list">
              <div className="agent-participant-avatar agent-host">
                <span>Host</span>
                <button className="agent-remove-participant">×</button>
              </div>
              <div className="agent-participant-avatar agent-host">
                <span>Host</span>
                <button className="agent-remove-participant">×</button>
              </div>
              <div className="agent-participant-avatar agent-host">
                <span>Host</span>
                <button className="agent-remove-participant">×</button>
              </div>
            </div>
          </div>

          <div className="agent-repeating-toggle">
            <input
              type="checkbox"
              id="repeating"
              checked={isRepeating}
              onChange={() => setIsRepeating(!isRepeating)}
            />
            <label htmlFor="repeating">Repeating</label>
          </div>

          <div className="agent-weekday-selector">
            {weekdays.map((day, index) => (
              <button
                key={index}
                className={`agent-weekday-btn ${selectedWeekdays.includes(day) ? 'agent-active' : ''}`}
                onClick={() => toggleWeekday(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="agent-schedule-actions">
            <button className="agent-cancel-btn">Cancel</button>
            <button className="agent-save-btn">Save</button>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default Dashboard;
