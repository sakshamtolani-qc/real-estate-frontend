import React, { useState, useEffect } from 'react';
import AddStaffForm from './AddStaffForm';
import Modal from './Modal';
import { Filter, Plus, Search, ChevronDown } from 'lucide-react';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
import './EmployeeList.css';

interface Employee {
  id: number;
  name: string;
  phone: string;
  leads: number;
  dealsClose: number;
  status: 'Active' | 'InActive';
  user_id: number;
  profile_photo_url?: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/accounts/list/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      const employeesArr = Array.isArray(data.results) ? data.results : [];
      
      // Fetch leads and deals count for each employee
      const employeePromises = employeesArr.map(async (emp: any) => {
        let leadsCount = 0;
        let dealsCloseCount = 0;
        
        try {
          // Fetch leads assigned to this employee
          const leadsRes = await fetch('http://localhost:8000/api/leads/list/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const leadsData = await leadsRes.json();
          const leadsArr = Array.isArray(leadsData.results) ? leadsData.results : [];
          leadsCount = leadsArr.filter((lead: any) => lead.assigned_to?.id === emp.id).length;
          
          // Fetch deals closed by this employee (leads with status 'Won')
          dealsCloseCount = leadsArr.filter((lead: any) => lead.assigned_to?.id === emp.id && lead.status === 'won').length;
        } catch (err) {
          console.error('Failed to fetch leads for employee', emp.id, err);
        }
        
        return {
          id: emp.id,
          name: (emp.user.first_name && emp.user.first_name.length > 0) ? emp.user.first_name : emp.user.username,
          phone: emp.user.phone,
          leads: leadsCount,
          dealsClose: dealsCloseCount,
          status: emp.status,
          user_id: emp.user.id,
          profile_photo_url: emp.user.profile_photo_url || undefined
        };
      });
      
      const employeeList = await Promise.all(employeePromises);
      setEmployees(employeeList);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    const sortableEmployees = [...employees];
    if (sortConfig.key !== null) {
      const key = sortConfig.key;
      sortableEmployees.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  const filteredEmployees = sortedEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.phone.includes(searchQuery)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFiltersClick = () => {
    console.log('Filters clicked');
  };

  const handleAddStaffClick = () => {
    setShowAddForm(true);
  };
  const handleStaffAdded = () => {
    setShowAddForm(false);
    fetchEmployees();
  };

  return (
    <div className="employee-list-container">
      <AdminHeader />

      <main className="employee-list-main">
        <div className="employee-list-content">
          <h1 className="employee-list-title">
            Employee's <span className="title-highlight">List</span>
          </h1>

          <div className="employee-list-actions">
            <button className="filters-btn" onClick={handleFiltersClick}>
              <Filter size={18} />
              Filters
            </button>
            <button className="add-staff-btn" onClick={handleAddStaffClick}>
              <Plus size={18} />
              Add Staff
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
              <AddStaffForm onStaffAdded={handleStaffAdded} />
            </Modal>
          )}

          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>
                    <div className="th-content">
                      Name
                      <ChevronDown size={16} className="sort-icon" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('phone')}>
                    <div className="th-content">
                      Phone No.
                      <ChevronDown size={16} className="sort-icon" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('leads')}>
                    <div className="th-content">
                      Leads
                      <ChevronDown size={16} className="sort-icon" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('dealsClose')}>
                    <div className="th-content">
                      Deals Closed
                      <ChevronDown size={16} className="sort-icon" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')}>
                    <div className="th-content">
                      Status
                      <ChevronDown size={16} className="sort-icon" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {employee.profile_photo_url ? (
                          <img 
                            src={employee.profile_photo_url}
                            alt={employee.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#D4AF37',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: 'white'
                            }}
                          >
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{employee.name}</span>
                      </div>
                    </td>
                    <td>{employee.phone}</td>
                    <td>{employee.leads}</td>
                    <td>{employee.dealsClose}</td>
                    <td>
                      <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                        {employee.status}
                      </span>
                    </td>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployeeList;
