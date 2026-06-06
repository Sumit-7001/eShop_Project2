import React, { useState } from 'react';
import {
  Users, DollarSign, Calendar, AlertCircle, Plus, Check, X, Wallet
} from 'lucide-react';

export const HRMPanel = ({ cSym = '$', onDisburseSalary }) => {
  const [hrmActiveTab, setHrmActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([
    { id: 'EMP-001', name: 'Dev Kar', role: 'Support Executive', department: 'Customer Service', salary: 3200, status: 'active', email: 'dev.kar@email.com' },
    { id: 'EMP-002', name: 'Riya Roy', role: 'UX Designer', department: 'Product Design', salary: 4500, status: 'active', email: 'riya.roy@email.com' },
    { id: 'EMP-003', name: 'Sumit Das', role: 'Admin Director', department: 'Management', salary: 6500, status: 'active', email: 'sumit.das@email.com' },
    { id: 'EMP-004', name: 'Arun Sen', role: 'Senior Engineer', department: 'Engineering', salary: 5800, status: 'active', email: 'arun.sen@email.com' },
    { id: 'EMP-005', name: 'Priya Sharma', role: 'Sales Executive', department: 'Sales & Marketing', salary: 3000, status: 'active', email: 'priya.sharma@email.com' },
  ]);
  const [departments] = useState([
    'Management', 'Engineering', 'Product Design', 'Customer Service', 'Sales & Marketing'
  ]);
  const [attendance, setAttendance] = useState([
    { empId: 'EMP-001', date: 'Today', status: 'Present', checkIn: '09:05 AM' },
    { empId: 'EMP-002', date: 'Today', status: 'Late', checkIn: '09:45 AM' },
    { empId: 'EMP-003', date: 'Today', status: 'Present', checkIn: '08:50 AM' },
    { empId: 'EMP-004', date: 'Today', status: 'Present', checkIn: '09:00 AM' },
    { empId: 'EMP-005', date: 'Today', status: 'Absent', checkIn: '-' },
  ]);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-01', empName: 'Riya Roy', type: 'Sick Leave', duration: '2 Days (June 2 - June 3)', status: 'Pending', reason: 'Flu symptoms' },
    { id: 'LR-02', empName: 'Arun Sen', type: 'Casual Leave', duration: '1 Day (June 8)', status: 'Approved', reason: 'Family event' },
    { id: 'LR-03', empName: 'Priya Sharma', type: 'Maternity Leave', duration: '30 Days (July 1 - July 30)', status: 'Pending', reason: 'Medical advice' },
  ]);

  const [newEmployeeForm, setNewEmployeeForm] = useState({ name: '', role: '', department: 'Engineering', salary: '', email: '' });
  const [payrollEmpId, setPayrollEmpId] = useState('EMP-001');
  const [payrollBonus, setPayrollBonus] = useState(0);
  const [payrollDeduct, setPayrollDeduct] = useState(0);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployeeForm.name || !newEmployeeForm.role || !newEmployeeForm.salary || !newEmployeeForm.email) return;
    const nEmp = {
      id: 'EMP-' + (employees.length + 1).toString().padStart(3, '0'),
      name: newEmployeeForm.name,
      role: newEmployeeForm.role,
      department: newEmployeeForm.department,
      salary: parseInt(newEmployeeForm.salary, 10),
      status: 'active',
      email: newEmployeeForm.email
    };
    setEmployees(prev => [...prev, nEmp]);
    // Add default attendance today
    setAttendance(prev => [...prev, { empId: nEmp.id, date: 'Today', status: 'Present', checkIn: '09:00 AM' }]);
    setNewEmployeeForm({ name: '', role: '', department: 'Engineering', salary: '', email: '' });
  };

  const totalSalaries = employees.reduce((acc, emp) => acc + (emp.status === 'active' ? emp.salary : 0), 0);
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  return (
    <div className="panel-hrm">
      {/* HRM Stats Summary */}
      <div className="inv-summary-grid">
        <div className="inv-summary-card blue">
          <Users size={24} />
          <div>
            <h4>{employees.length}</h4>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="inv-summary-card green">
          <DollarSign size={24} />
          <div>
            <h4>{cSym}{totalSalaries.toLocaleString()}/mo</h4>
            <p>Total Salary Load</p>
          </div>
        </div>
        <div className="inv-summary-card amber">
          <Calendar size={24} />
          <div>
            <h4>{presentCount} / {employees.length}</h4>
            <p>Present Today</p>
          </div>
        </div>
        <div className="inv-summary-card red">
          <AlertCircle size={24} />
          <div>
            <h4>{pendingLeaves} Requests</h4>
            <p>Leaves Pending</p>
          </div>
        </div>
      </div>

      {/* HRM Navigation Sub-tabs */}
      <div className="erp-tabs-nav no-print" style={{ display: 'flex', gap: '8px', margin: '20px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        {[
          { id: 'employees', label: 'Employees Directory', icon: Users },
          { id: 'attendance', label: 'Attendance Ledger', icon: Calendar },
          { id: 'leaves', label: 'Leave Requests', icon: AlertCircle },
          { id: 'payroll', label: 'Payroll Processor', icon: Wallet },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setHrmActiveTab(tab.id)}
            className={`erp-tab-btn ${hrmActiveTab === tab.id ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: hrmActiveTab === tab.id ? 'var(--primary-color)' : 'transparent',
              color: hrmActiveTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {hrmActiveTab === 'employees' && (
        <div className="overview-grid-2col">
          <div className="panel-card" style={{ flex: '2' }}>
            <h4>Employees Directory</h4>
            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Monthly Base</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{emp.name}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{emp.email}</span>
                        </div>
                      </td>
                      <td><span className="cat-chip">{emp.department}</span></td>
                      <td>{emp.role}</td>
                      <td><strong>{cSym}{emp.salary.toLocaleString()}</strong></td>
                      <td>
                        <span className="user-status-badge status-active">{emp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-card">
            <h4>Register New Staff</h4>
            <form onSubmit={handleAddEmployee} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="mf-group">
                <label>Full Employee Name *</label>
                <input type="text" value={newEmployeeForm.name} onChange={e => setNewEmployeeForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Rahul Das" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Work Email Address *</label>
                <input type="email" value={newEmployeeForm.email} onChange={e => setNewEmployeeForm(prev => ({ ...prev, email: e.target.value }))} placeholder="e.g. rahul@eshop.com" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Work Role Designation *</label>
                <input type="text" value={newEmployeeForm.role} onChange={e => setNewEmployeeForm(prev => ({ ...prev, role: e.target.value }))} placeholder="e.g. Marketing Lead" required className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="mf-group">
                <label>Department Scope *</label>
                <select value={newEmployeeForm.department} onChange={e => setNewEmployeeForm(prev => ({ ...prev, department: e.target.value }))} className="status-selector" style={{ width: '100%', height: '38px' }}>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="mf-group">
                <label>Monthly Base Salary ({cSym}) *</label>
                <input type="number" value={newEmployeeForm.salary} onChange={e => setNewEmployeeForm(prev => ({ ...prev, salary: e.target.value }))} placeholder="e.g. 3500" required className="search-input" style={{ width: '100%' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><Plus size={16} /> Enlist Employee</button>
            </form>
          </div>
        </div>
      )}

      {hrmActiveTab === 'attendance' && (
        <div className="panel-card">
          <h4>Mark Daily Attendance Log</h4>
          <div className="table-wrap" style={{ marginTop: '15px' }}>
            <table className="admin-tbl">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Attendance Status</th>
                  <th>Recorded Check-In</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => {
                  const emp = employees.find(e => e.id === a.empId) || { name: 'Staff', role: '-' };
                  return (
                    <tr key={a.empId}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{emp.name}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{emp.role}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${a.status === 'Present' ? 'badge-delivered' : a.status === 'Late' ? 'badge-pending' : 'badge-cancelled'}`}>{a.status}</span>
                      </td>
                      <td>{a.checkIn}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button className="btn-primary-sm" onClick={() => {
                            setAttendance(prev => prev.map(item => item.empId === a.empId ? { ...item, status: 'Present', checkIn: '09:00 AM' } : item));
                          }}>Present</button>
                          <button className="btn-ghost-sm" onClick={() => {
                            setAttendance(prev => prev.map(item => item.empId === a.empId ? { ...item, status: 'Late', checkIn: '09:30 AM' } : item));
                          }}>Late</button>
                          <button className="btn-ghost-sm text-red" style={{ borderColor: '#ef444420' }} onClick={() => {
                            setAttendance(prev => prev.map(item => item.empId === a.empId ? { ...item, status: 'Absent', checkIn: '-' } : item));
                          }}>Absent</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hrmActiveTab === 'leaves' && (
        <div className="panel-card">
          <h4>Leave & Time-Off Approvals Manager</h4>
          <div className="table-wrap" style={{ marginTop: '15px' }}>
            <table className="admin-tbl">
              <thead>
                <tr>
                  <th>Staff Requesting</th>
                  <th>Leave Category</th>
                  <th>Requested Duration</th>
                  <th>Reasoning / Notes</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.empName}</strong></td>
                    <td><span className="cat-chip">{r.type}</span></td>
                    <td>{r.duration}</td>
                    <td><em className="text-muted">"{r.reason}"</em></td>
                    <td>
                      <span className={`admin-badge ${r.status === 'Approved' ? 'badge-delivered' : r.status === 'Rejected' ? 'badge-cancelled' : 'badge-pending'}`}>{r.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {r.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button className="btn-primary-sm" onClick={() => {
                            setLeaveRequests(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Approved' } : item));
                          }}><Check size={12} /> Approve</button>
                          <button className="btn-ghost-sm text-red" onClick={() => {
                            setLeaveRequests(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Rejected' } : item));
                          }}><X size={12} /> Reject</button>
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '12px' }}>Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hrmActiveTab === 'payroll' && (
        <div className="overview-grid-2col">
          <div className="panel-card">
            <h4>Active Monthly Salaries</h4>
            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table className="admin-tbl">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Monthly Base</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td><strong>{emp.name}</strong><br /><span className="text-muted" style={{ fontSize: '11px' }}>{emp.role}</span></td>
                      <td><strong>{cSym}{emp.salary.toLocaleString()}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-card">
            <h4>Process Payroll Payout</h4>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="mf-group">
                <label>Select Target Employee *</label>
                <select value={payrollEmpId} onChange={e => setPayrollEmpId(e.target.value)} className="status-selector" style={{ width: '100%', height: '38px' }}>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              {(() => {
                const emp = employees.find(e => e.id === payrollEmpId);
                if (!emp) return null;
                const base = emp.salary;
                const bonusVal = parseFloat(payrollBonus) || 0;
                const deductVal = parseFloat(payrollDeduct) || 0;
                const net = base + bonusVal - deductVal;

                return (
                  <>
                    <div className="mf-row" style={{ display: 'flex', gap: '10px' }}>
                      <div className="mf-group" style={{ flex: 1 }}>
                        <label>Performance Bonus ({cSym})</label>
                        <input type="number" value={payrollBonus || ''} onChange={e => setPayrollBonus(e.target.value)} placeholder="0" className="search-input" style={{ width: '100%' }} />
                      </div>
                      <div className="mf-group" style={{ flex: 1 }}>
                        <label>Tax Deductions ({cSym})</label>
                        <input type="number" value={payrollDeduct || ''} onChange={e => setPayrollDeduct(e.target.value)} placeholder="0" className="search-input" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div style={{ padding: '15px', borderRadius: '8px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', margin: '10px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Base Salary:</span>
                        <strong>{cSym}{base.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--badge-delivered)' }}>
                        <span>Bonus Additions:</span>
                        <span>+{cSym}{bonusVal.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--badge-cancelled)' }}>
                        <span>Deductions:</span>
                        <span>-{cSym}{deductVal.toLocaleString()}</span>
                      </div>
                      <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
                        <span>Net Payout:</span>
                        <span style={{ color: 'var(--primary-color)' }}>{cSym}{net.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onDisburseSalary) {
                          onDisburseSalary(emp.name, emp.role, net);
                          setPayrollBonus(0);
                          setPayrollDeduct(0);
                        }
                      }}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      <Wallet size={16} /> Disburse Monthly Salary
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
