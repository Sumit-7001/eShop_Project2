import React, { useState } from 'react';
import {
  Users, TrendingUp, CheckCircle2, XCircle, Plus
} from 'lucide-react';

export const CRMPanel = ({ cSym = '$' }) => {
  const [crmLeads, setCrmLeads] = useState([
    { id: 'LD-101', name: 'Rohan Gupta', company: 'Digital Solutions Inc', email: 'rohan@digisols.com', value: 4500, status: 'New', phone: '+91 99887 76655' },
    { id: 'LD-102', name: 'Nisha Mehta', company: 'Crafty Designs', email: 'nisha@craftydesigns.org', value: 1200, status: 'Contacted', phone: '+91 88776 65544' },
    { id: 'LD-103', name: 'Vikram Roy', company: 'Vortex Global', email: 'vikram@vortex.io', value: 8500, status: 'Proposal', phone: '+91 77665 54433' },
    { id: 'LD-104', name: 'Sneha Bose', company: 'Prime Builders', email: 'sneha@primebuilders.in', value: 12500, status: 'Won', phone: '+91 66554 43322' },
    { id: 'LD-105', name: 'Abhishek Sen', company: 'Apex Retails', email: 'abhishek@apex.com', value: 3100, status: 'Lost', phone: '+91 55443 32211' },
  ]);
  const [newLeadForm, setNewLeadForm] = useState({ name: '', company: '', email: '', value: '', status: 'New', phone: '' });

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.company || !newLeadForm.value) return;
    const nLead = {
      id: 'LD-' + (100 + crmLeads.length + 1).toString(),
      name: newLeadForm.name,
      company: newLeadForm.company,
      email: newLeadForm.email || 'N/A',
      phone: newLeadForm.phone || 'N/A',
      value: parseInt(newLeadForm.value, 10),
      status: newLeadForm.status
    };
    setCrmLeads(prev => [...prev, nLead]);
    setNewLeadForm({ name: '', company: '', email: '', value: '', status: 'New', phone: '' });
  };

  const moveLead = (id, direction) => {
    const statusOrder = ['New', 'Contacted', 'Proposal', 'Won', 'Lost'];
    setCrmLeads(prev => prev.map(lead => {
      if (lead.id !== id) return lead;
      const curIdx = statusOrder.indexOf(lead.status);
      let newIdx = curIdx + direction;
      if (newIdx < 0 || newIdx >= statusOrder.length) return lead;
      const newStatus = statusOrder[newIdx];
      if (newStatus === 'Won') {
        setTimeout(() => alert(`🎉 Incredible! Closed deal with ${lead.name} from ${lead.company} successfully! Potential value of ${cSym}${lead.value.toLocaleString()} secured!`), 100);
      }
      return { ...lead, status: newStatus };
    }));
  };

  const totalPotential = crmLeads.reduce((acc, l) => acc + (l.status !== 'Lost' ? l.value : 0), 0);
  const closedWon = crmLeads.filter(l => l.status === 'Won').reduce((acc, l) => acc + l.value, 0);
  const closedLost = crmLeads.filter(l => l.status === 'Lost').reduce((acc, l) => acc + l.value, 0);

  return (
    <div className="panel-crm">
      {/* CRM Stats Summary */}
      <div className="inv-summary-grid">
        <div className="inv-summary-card blue">
          <Users size={24} />
          <div>
            <h4>{crmLeads.length}</h4>
            <p>Active CRM Leads</p>
          </div>
        </div>
        <div className="inv-summary-card amber">
          <TrendingUp size={24} />
          <div>
            <h4>{cSym}{totalPotential.toLocaleString()}</h4>
            <p>Pipeline Deal Value</p>
          </div>
        </div>
        <div className="inv-summary-card green">
          <CheckCircle2 size={24} />
          <div>
            <h4>{cSym}{closedWon.toLocaleString()}</h4>
            <p>Closed Won (Revenue)</p>
          </div>
        </div>
        <div className="inv-summary-card red">
          <XCircle size={24} />
          <div>
            <h4>{cSym}{closedLost.toLocaleString()}</h4>
            <p>Closed Lost</p>
          </div>
        </div>
      </div>

      {/* CRM Pipeline Kanban Grid */}
      <div className="panel-card mt-20 no-pad">
        <div className="table-head-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Interactive B2B Deals Pipeline</h4>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', padding: '15px', overflowX: 'auto' }}>
          {['New', 'Contacted', 'Proposal', 'Won', 'Lost'].map(col => {
            const colLeads = crmLeads.filter(l => l.status === col);
            const colValue = colLeads.reduce((acc, l) => acc + l.value, 0);
            
            let colHeaderColor = '#3b82f6';
            if (col === 'Contacted') colHeaderColor = '#8b5cf6';
            if (col === 'Proposal') colHeaderColor = '#f59e0b';
            if (col === 'Won') colHeaderColor = '#10b981';
            if (col === 'Lost') colHeaderColor = '#ef4444';

            return (
              <div key={col} style={{ flex: '1', minWidth: '240px', background: 'var(--adm-bg)', borderRadius: '8px', padding: '12px', borderTop: `4px solid ${colHeaderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{col} ({colLeads.length})</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cSym}{colValue.toLocaleString()}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '300px' }}>
                  {colLeads.map(lead => (
                    <div key={lead.id} style={{ background: 'var(--adm-surface)', borderRadius: '6px', padding: '10px', boxShadow: 'var(--adm-shadow)', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '13px' }}>{lead.company}</strong>
                        <span style={{ fontSize: '11px', background: 'var(--adm-bg)', color: 'var(--adm-text-2)', padding: '2px 6px', borderRadius: '4px' }}>{lead.id}</span>
                      </div>
                      <span className="text-muted" style={{ fontSize: '12px' }}>Executive: {lead.name}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span>{lead.email}</span>
                        <strong>{cSym}{lead.value.toLocaleString()}</strong>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--adm-border)', paddingTop: '6px', marginTop: '4px' }}>
                        <button
                          disabled={col === 'New'}
                          onClick={() => moveLead(lead.id, -1)}
                          style={{ padding: '3px 8px', borderRadius: '4px', border: 'none', background: 'none', cursor: lead.status === 'New' ? 'not-allowed' : 'pointer', color: 'var(--text-muted)' }}
                        >
                          ←
                        </button>
                        <button
                          disabled={col === 'Lost'}
                          onClick={() => moveLead(lead.id, 1)}
                          style={{ padding: '3px 8px', borderRadius: '4px', border: 'none', background: 'none', cursor: lead.status === 'Lost' ? 'not-allowed' : 'pointer', color: 'var(--primary-color)', fontWeight: 'bold' }}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', marginTop: '30px' }}>No Deals here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Lead Form Card */}
      <div className="panel-card mt-20">
        <h4>Capture Prospective Lead</h4>
        <form onSubmit={handleAddLead} style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div className="mf-group">
            <label>Contact Name *</label>
            <input type="text" value={newLeadForm.name} onChange={e => setNewLeadForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Sneha Bose" required className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="mf-group">
            <label>Company/Organization *</label>
            <input type="text" value={newLeadForm.company} onChange={e => setNewLeadForm(prev => ({ ...prev, company: e.target.value }))} placeholder="e.g. Prime Builders" required className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="mf-group">
            <label>Deal Potential Value ({cSym}) *</label>
            <input type="number" value={newLeadForm.value} onChange={e => setNewLeadForm(prev => ({ ...prev, value: e.target.value }))} placeholder="e.g. 15000" required className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="mf-group">
            <label>Email Address</label>
            <input type="email" value={newLeadForm.email} onChange={e => setNewLeadForm(prev => ({ ...prev, email: e.target.value }))} placeholder="e.g. sneha@prime.com" className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="mf-group" style={{ gridColumn: 'span 1' }}>
            <label>Contact Telephone</label>
            <input type="text" value={newLeadForm.phone} onChange={e => setNewLeadForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="e.g. +91 99000 77000" className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="mf-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', height: '38px' }}><Plus size={16} /> Capture Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};
