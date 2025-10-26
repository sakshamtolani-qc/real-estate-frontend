import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { PageLoader } from '../../components/common/Loader';
import { getGreetingForMumbai } from '../../utils';
import api from '../../services/api';
import './Dashboard.css';

interface Stat {
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  subtext?: string;
}

interface Employee {
  name: string;
  phone: string;
  date: string;
  status: 'Active' | 'InActive';
}

interface TopCloser {
  id?: number;
  user_id?: number;
  name: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
  lead_count?: number;
  deals?: number;
}

interface LeadSourceData {
  source: string;
  percentage: number;
  color: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<Stat[]>([
    { label: "Total Revenue", subtext: "This Month", value: "0", trend: "0%", color: "#8BC5B8" },
    { label: "New Leads", subtext: "This Month", value: "0", color: "#FFB38A" },
    { label: "Offers Made", subtext: "This Month", value: "0", color: "#F5D98E" },
    { label: "Deals Closed", subtext: "This Month", value: "0", trend: "0%", color: "#A5E8D8" }
  ]);
  const [topClosers, setTopClosers] = useState<TopCloser[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSourceData[]>([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Prevent browser caching of this page and handle back button
  useEffect(() => {
    // Verify authentication only when page visibility changes (back button)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (!token || !storedUser) {
          navigate('/login', { replace: true });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Memoize fetchStats so it can be used in dependency arrays
  const fetchStats = useCallback(async () => {
    try {
      const response: any = await api.get('/admin/dashboard/stats/');
      const data = response.data || response;
      
      console.log('Dashboard stats API response:', data);
      
      if (data && data.stats) {
        console.log('Setting stats from API:', data.stats);
        setStats(data.stats);
      }
      
      if (data && data.top_closers) {
        console.log('Setting top closers from API:', data.top_closers);
        setTopClosers(data.top_closers);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);
  
  useEffect(() => {
    // Wait for auth to finish loading, then check if user is authenticated
    if (isLoading) {
      return;
    }
    
    if (!user) {
      return;
    }

    // Fetch employees
    const fetchEmployees = async () => {
      try {
        const response: any = await api.get('/accounts/list/');
        const data = response.data || response;
        const employeesArr = Array.isArray(data.results) ? data.results : (Array.isArray(response.results) ? response.results : []);
        setEmployees(
          employeesArr.map((emp: any) => ({
            name: (emp.user.first_name && emp.user.first_name.length > 0) ? emp.user.first_name : emp.user.username,
            phone: emp.user.phone,
            date: emp.date_joined,
            status: emp.status,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };
    
    // Fetch lead sources
    const fetchLeadSources = async () => {
      try {
        const response: any = await api.get('/leads/lead-sources/');
        const data = response.data || response;
        setLeadSources(data.lead_sources || []);
        if (data.lead_sources && data.lead_sources.length > 0) {
          setSelectedSource(data.lead_sources[0].source);
        }
      } catch (err) {
        console.error('Failed to fetch lead sources', err);
      }
    };
    
    // Fetch user name
    const fetchUserName = async () => {
      try {
        const response: any = await api.get('/accounts/profile/');
        const data = response.data || response;
        setUserName(data.first_name || data.username || '');
      } catch (err) {
        console.error('Failed to fetch user name', err);
      }
    };
    
    const loadAllData = async () => {
      setIsLoadingData(true);
      const startTime = Date.now();
      await Promise.all([
        fetchEmployees(),
        fetchStats(),
        fetchLeadSources(),
        fetchUserName()
      ]);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        setIsLoadingData(false);
      }, remainingTime);
    };

    loadAllData();
    
    // Set up interval for KPI auto-refresh every 15 seconds
    const refreshInterval = setInterval(() => {
      fetchStats();
    }, 15000);
    
    return () => clearInterval(refreshInterval);
  }, [user, isLoading, fetchStats]);


  // Show loading state while fetching data
  if (isLoadingData) {
    return <PageLoader message="Loading Dashboard..." fullScreen={true} />;
  }

  return (
    <div className="dashboard-container">
      <AdminHeader />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="top-stats-row">
            <div className="greeting-card">
              <div className="greeting-content">
                <h1 className="greeting-title">{getGreetingForMumbai().greeting} {getGreetingForMumbai().emoji}</h1>
                <p className="greeting-name">{userName}</p>
                <p className="greeting-subtitle">Here is your weekly overview report</p>
              </div>
              <div className="greeting-illustration">
                <img src="/illustration.svg" alt="Dashboard illustration" />
              </div>
            </div>

            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ backgroundColor: stat.color }}>
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                </div>
                {stat.subtext && <p className="stat-subtext">{stat.subtext}</p>}
                <div className="stat-value-row">
                  <h2 className="stat-value">{stat.value}</h2>
                  {stat.trend && (
                    <span className="stat-trend">
                      <TrendingUp className="trend-icon" /> {stat.trend}
                    </span>
                  )}
                </div>
                {(stat.label === 'Total Revenue' || stat.label === 'Deals Closed') && (
                  <div className="stat-chart">
                    <svg viewBox="0 0 100 30" className="chart-svg">
                      <path
                        d="M 0 25 Q 25 20 50 15 T 100 5"
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="main-content-grid">
            <div className="left-column">
              <div className="top-closers-card">
                <h2 className="card-title">
                Top <span style={{ color: '#D4AF37' }}>Closers</span>
                </h2>
              <p className="card-subtitle">This Quarter</p>
              <div className="closers-grid">
                {topClosers.map((closer, index) => (
                  <div key={index} className="closer-item">
                    <div className="closer-avatar-wrapper">
                      {closer.profile_photo_url ? (
                        <img 
                          src={closer.profile_photo_url} 
                          alt={closer.name}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="closer-avatar" style={{ background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', fontSize: '24px', color: 'white' }}>
                          {closer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="closer-badge">
                        <span>🏆</span>
                      </div>
                    </div>
                    <p className="closer-name">{closer.name}</p>
                    <p className="closer-deals">Deals: {closer.deals ?? closer.lead_count ?? 0}</p>
                  </div>
                ))}
              </div>
            </div>

              <div className="employee-card">
                <div className="employee-header">
                  <h2 className="card-title">Employee</h2>
                  <button className="view-list-btn" onClick={() => navigate('/admin/employees')}>
                    View List
                  </button>
                </div>
                <div className="employee-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="th-content">
                            Name <span className="sort-icon">▼</span>
                          </div>
                        </th>
                        <th>
                          <div className="th-content">
                            Phone No. <span className="sort-icon">▼</span>
                          </div>
                        </th>
                        <th>
                          <div className="th-content">
                            Date <span className="sort-icon">▼</span>
                          </div>
                        </th>
                        <th>
                          <div className="th-content">
                            Lead Status <span className="sort-icon">▼</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={index}>
                          <td>{employee.name}</td>
                          <td>{employee.phone}</td>
                          <td>{employee.date}</td>
                          <td>
                            <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                              • {employee.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="right-column">
              <div className="lead-source-card">
                <div className="lead-source-header">
                <h2 className="card-title">Lead Source</h2>
                <p className="card-subtitle">in Last 30 days</p>
              </div>
              <div className="donut-chart-container">
                <div className="donut-chart">
                  <svg viewBox="0 0 200 200" className="donut-svg">
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#E7C873"
                      strokeWidth="40"
                      strokeDasharray="110 330"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#7DD3E8"
                      strokeWidth="40"
                      strokeDasharray="110 330"
                      strokeDashoffset="-110"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="40"
                      strokeDasharray="110 330"
                      strokeDashoffset="-220"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#B794D6"
                      strokeWidth="40"
                      strokeDasharray="110 330"
                      strokeDashoffset="-330"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="donut-center">
                    <div className="donut-label">{selectedSource}</div>
                    <div className="donut-value">{leadSources.find(s => s.source === selectedSource)?.percentage}%</div>
                  </div>
                </div>
              </div>
              <div className="lead-source-legend">
                {leadSources.map((source, index) => (
                  <div
                    key={index}
                    className="legend-item"
                    onClick={() => setSelectedSource(source.source)}
                  >
                    <div className="legend-color" style={{ backgroundColor: source.color }}></div>
                    <span className="legend-label">{source.source}</span>
                    <span className="legend-value">{source.percentage} ({source.percentage}%)</span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
