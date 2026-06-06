import React, { useState } from 'react';
import {
  DollarSign, Activity, AlertCircle, Plus
} from 'lucide-react';

export const AccountingPanel = ({
  chartOfAccounts = [],
  setChartOfAccounts,
  ledgerTransactions = [],
  setLedgerTransactions,
  cSym = '$'
}) => {
  const [newTransactionForm, setNewTransactionForm] = useState({ accountCode: '1010', description: '', amount: '', type: 'debit' });

  const handleRecordTransaction = (e) => {
    e.preventDefault();
    if (!newTransactionForm.description || !newTransactionForm.amount) return;
    const amountVal = parseFloat(newTransactionForm.amount);
    
    // Find target Chart of Account name
    const acc = chartOfAccounts.find(a => a.code === newTransactionForm.accountCode) || chartOfAccounts[0];
    
    const isDebit = newTransactionForm.type === 'debit';
    const deb = isDebit ? amountVal : 0;
    const cred = !isDebit ? amountVal : 0;
    
    const newTx = {
      id: 'TX-' + (ledgerTransactions.length + 1).toString().padStart(3, '0'),
      date: new Date().toISOString().split('T')[0],
      description: newTransactionForm.description,
      debit: deb,
      credit: cred,
      account: acc.name
    };
    
    setLedgerTransactions(prev => [newTx, ...prev]);

    // Update balance of the Chart of Account!
    // Assets & Expenses increase on Debit, decrease on Credit.
    // Revenues & Liabilities increase on Credit, decrease on Debit.
    setChartOfAccounts(prev => prev.map(a => {
      if (a.code !== acc.code) return a;
      let diff = 0;
      if (a.category === 'Asset' || a.category === 'Expense') {
        diff = deb - cred;
      } else {
        diff = cred - deb;
      }
      return { ...a, balance: a.balance + diff };
    }));

    setNewTransactionForm({ accountCode: '1010', description: '', amount: '', type: 'debit' });
    alert(`Journal entry recorded successfully! Account "${acc.name}" balance adjusted.`);
  };

  const totalAssets = chartOfAccounts.filter(a => a.category === 'Asset').reduce((acc, a) => acc + a.balance, 0);
  const totalRevenues = chartOfAccounts.filter(a => a.category === 'Revenue').reduce((acc, a) => acc + a.balance, 0);
  const totalExpenses = chartOfAccounts.filter(a => a.category === 'Expense').reduce((acc, a) => acc + a.balance, 0);

  return (
    <div className="panel-accounting">
      {/* Accounting Stats Summary */}
      <div className="inv-summary-grid">
        <div className="inv-summary-card blue">
          <DollarSign size={24} />
          <div>
            <h4>{cSym}{totalAssets.toLocaleString()}</h4>
            <p>Total Asset Holdings</p>
          </div>
        </div>
        <div className="inv-summary-card green">
          <Activity size={24} />
          <div>
            <h4>{cSym}{totalRevenues.toLocaleString()}</h4>
            <p>Total Revenue Log</p>
          </div>
        </div>
        <div className="inv-summary-card red">
          <AlertCircle size={24} />
          <div>
            <h4>{cSym}{totalExpenses.toLocaleString()}</h4>
            <p>Total Operating Expense</p>
          </div>
        </div>
      </div>

      <div className="overview-grid-2col" style={{ marginTop: '20px' }}>
        {/* Chart of Accounts */}
        <div className="panel-card" style={{ flex: '2' }}>
          <h4>General Chart of Accounts</h4>
          <div className="table-wrap" style={{ marginTop: '15px' }}>
            <table className="admin-tbl">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Account Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Operating Balance</th>
                </tr>
              </thead>
              <tbody>
                {chartOfAccounts.map(a => (
                  <tr key={a.code}>
                    <td><strong style={{ color: 'var(--primary-color)' }}>{a.code}</strong></td>
                    <td><strong>{a.name}</strong></td>
                    <td><span className="cat-chip">{a.category}</span></td>
                    <td style={{ textAlign: 'right' }}><strong>{cSym}{a.balance.toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Transaction Voucher Form */}
        <div className="panel-card">
          <h4>Post Accounting Voucher</h4>
          <form onSubmit={handleRecordTransaction} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="mf-group">
              <label>Select Target Ledger Account *</label>
              <select value={newTransactionForm.accountCode} onChange={e => setNewTransactionForm(prev => ({ ...prev, accountCode: e.target.value }))} className="status-selector" style={{ width: '100%', height: '38px' }}>
                {chartOfAccounts.map(a => (
                  <option key={a.code} value={a.code}>{a.code} — {a.name} ({a.category})</option>
                ))}
              </select>
            </div>
            <div className="mf-group">
              <label>Journal Entry Description *</label>
              <input type="text" value={newTransactionForm.description} onChange={e => setNewTransactionForm(prev => ({ ...prev, description: e.target.value }))} placeholder="e.g. Paid Office Utility Electricity Bill" required className="search-input" style={{ width: '100%' }} />
            </div>
            <div className="mf-row" style={{ display: 'flex', gap: '10px' }}>
              <div className="mf-group" style={{ flex: 1 }}>
                <label>Voucher Type *</label>
                <select value={newTransactionForm.type} onChange={e => setNewTransactionForm(prev => ({ ...prev, type: e.target.value }))} className="status-selector" style={{ width: '100%', height: '38px' }}>
                  <option value="debit">Debit (+ Asset / Expense)</option>
                  <option value="credit">Credit (+ Revenue / Liability)</option>
                </select>
              </div>
              <div className="mf-group" style={{ flex: 1 }}>
                <label>Voucher Amount ({cSym}) *</label>
                <input type="number" value={newTransactionForm.amount} onChange={e => setNewTransactionForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="e.g. 500" required className="search-input" style={{ width: '100%' }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><Plus size={16} /> Post Journal Voucher</button>
          </form>
        </div>
      </div>

      {/* General Transaction Ledger */}
      <div className="panel-card no-pad mt-20">
        <div className="table-head-bar">
          <h4>General Transaction Ledger Logs</h4>
        </div>
        <div className="table-wrap">
          <table className="admin-tbl">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Posting Date</th>
                <th>Description</th>
                <th>Ledger Account</th>
                <th style={{ textAlign: 'right' }}>Debit</th>
                <th style={{ textAlign: 'right' }}>Credit</th>
              </tr>
            </thead>
            <tbody>
              {ledgerTransactions.map(tx => (
                <tr key={tx.id}>
                  <td><strong style={{ color: 'var(--primary-color)' }}>{tx.id}</strong></td>
                  <td>{tx.date}</td>
                  <td>{tx.description}</td>
                  <td><span className="cat-chip">{tx.account}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: tx.debit > 0 ? 'var(--badge-delivered)' : '' }}>{tx.debit > 0 ? `+${cSym}${tx.debit.toLocaleString()}` : '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: tx.credit > 0 ? 'var(--badge-cancelled)' : '' }}>{tx.credit > 0 ? `-${cSym}${tx.credit.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
