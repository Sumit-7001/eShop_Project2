import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

export const ProjectsPanel = () => {
  const { isDark } = useApp();
  const [projectsList] = useState([
    { id: 'PRJ-01', name: 'eShop Storefront V2', description: 'Redesigning frontend with modern layouts.' },
    { id: 'PRJ-02', name: 'Warehouse Automation', description: 'Implementing robotic stock checking tools.' },
    { id: 'PRJ-03', name: 'Marketing Campaign H2', description: 'Launching global promotion campaigns across Google & Facebook.' },
  ]);
  const [currentProject, setCurrentProject] = useState('PRJ-01');
  const [projectTasks, setProjectTasks] = useState([
    { id: 'TSK-201', projectId: 'PRJ-01', title: 'Implement dynamic cart sync', priority: 'High', status: 'To Do', desc: 'Sync local cart state with backend DB dynamically.' },
    { id: 'TSK-202', projectId: 'PRJ-01', title: 'Design admin analytics', priority: 'Medium', status: 'In Progress', desc: 'Add interactive daily and weekly sales graphs.' },
    { id: 'TSK-203', projectId: 'PRJ-01', title: 'Code email templates', priority: 'High', status: 'Review', desc: 'Create NodeMailer visual invoices and verification codes.' },
    { id: 'TSK-204', projectId: 'PRJ-01', title: 'Setup Vercel hosting rules', priority: 'Low', status: 'Completed', desc: 'Alias custom routes to server.js on production.' },
    { id: 'TSK-205', projectId: 'PRJ-02', title: 'Program bar scanner', priority: 'High', status: 'To Do', desc: 'Write WebUSB integration to scan stock bar codes.' },
    { id: 'TSK-206', projectId: 'PRJ-02', title: 'Test multi-hub syncing', priority: 'Medium', status: 'In Progress', desc: 'Verify stock shifts match Central, Delhi & Mumbai hubs.' },
  ]);
  const [newTaskForm, setNewTaskForm] = useState({ title: '', priority: 'Medium', desc: '', status: 'To Do' });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.title) return;
    const nTask = {
      id: 'TSK-' + (200 + projectTasks.length + 1).toString(),
      projectId: currentProject,
      title: newTaskForm.title,
      priority: newTaskForm.priority,
      status: newTaskForm.status,
      desc: newTaskForm.desc || 'No description provided.'
    };
    setProjectTasks(prev => [...prev, nTask]);
    setNewTaskForm({ title: '', priority: 'Medium', desc: '', status: 'To Do' });
  };

  const moveTask = (id, direction) => {
    const statusOrder = ['To Do', 'In Progress', 'Review', 'Completed'];
    setProjectTasks(prev => prev.map(tsk => {
      if (tsk.id !== id) return tsk;
      const curIdx = statusOrder.indexOf(tsk.status);
      let newIdx = curIdx + direction;
      if (newIdx < 0 || newIdx >= statusOrder.length) return tsk;
      return { ...tsk, status: statusOrder[newIdx] };
    }));
  };

  const activeProject = projectsList.find(p => p.id === currentProject) || projectsList[0];
  const totalProjTasks = projectTasks.filter(t => t.projectId === currentProject);
  const completedTasksCount = totalProjTasks.filter(t => t.status === 'Completed').length;
  const progressPct = totalProjTasks.length > 0 ? Math.round((completedTasksCount / totalProjTasks.length) * 100) : 0;

  return (
    <div className="panel-projects">
      {/* Project Selector Bar */}
      <div className="panel-card no-pad" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Active Project Scope:</span>
            <select value={currentProject} onChange={e => setCurrentProject(e.target.value)} className="status-selector" style={{ height: '36px' }}>
              {projectsList.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px' }}>Project Progress: <strong>{progressPct}%</strong></span>
            <div className="inventory-bar-track" style={{ width: '120px', height: '10px', margin: 0 }}>
              <div className="inventory-bar-fill" style={{ width: `${progressPct}%`, background: 'var(--primary-color)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Project Board Details Column */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {/* Kanban Columns */}
        <div className="panel-card no-pad" style={{ flex: '3', minWidth: '320px' }}>
          <div className="table-head-bar">
            <h4>Task Planning Board ({activeProject.name})</h4>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto' }}>
            {['To Do', 'In Progress', 'Review', 'Completed'].map(col => {
              const colTasks = totalProjTasks.filter(t => t.status === col);
              
              let columnColor = '#cbd5e1';
              if (col === 'In Progress') columnColor = '#3b82f6';
              if (col === 'Review') columnColor = '#f59e0b';
              if (col === 'Completed') columnColor = '#10b981';

              return (
                <div key={col} style={{ flex: '1', minWidth: '220px', background: 'var(--adm-bg)', borderRadius: '8px', padding: '10px', borderTop: `4px solid ${columnColor}` }}>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{col}</span>
                    <span style={{ background: 'var(--adm-border)', color: 'var(--adm-text)', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' }}>{colTasks.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '260px' }}>
                    {colTasks.map(tsk => (
                      <div key={tsk.id} style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: 'var(--adm-shadow)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: tsk.priority === 'High' ? (isDark ? 'rgba(239, 68, 68, 0.18)' : '#fee2e2') : tsk.priority === 'Medium' ? (isDark ? 'rgba(245, 158, 11, 0.18)' : '#fef3c7') : (isDark ? 'rgba(59, 130, 246, 0.18)' : '#dbeafe'),
                            color: tsk.priority === 'High' ? (isDark ? '#fda4af' : '#ef4444') : tsk.priority === 'Medium' ? (isDark ? '#fbbf24' : '#d97706') : (isDark ? '#60a5fa' : '#3b82f6')
                          }}>{tsk.priority}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tsk.id}</span>
                        </div>
                        <strong style={{ fontSize: '13px' }}>{tsk.title}</strong>
                        <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0' }}>{tsk.desc}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--adm-border)', paddingTop: '4px', marginTop: '4px' }}>
                          <button
                            disabled={col === 'To Do'}
                            onClick={() => moveTask(tsk.id, -1)}
                            style={{ padding: '2px 6px', border: 'none', background: 'none', cursor: col === 'To Do' ? 'not-allowed' : 'pointer', fontSize: '12px' }}
                          >
                            ←
                          </button>
                          <button
                            disabled={col === 'Completed'}
                            onClick={() => moveTask(tsk.id, 1)}
                            style={{ padding: '2px 6px', border: 'none', background: 'none', cursor: col === 'Completed' ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', marginTop: '20px' }}>No Tasks</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Task Form Card */}
        <div className="panel-card" style={{ flex: '1', minWidth: '240px' }}>
          <h4>Add Project Task</h4>
          <form onSubmit={handleAddTask} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="mf-group">
              <label>Task Summary Title *</label>
              <input type="text" value={newTaskForm.title} onChange={e => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Implement Oauth google login" required className="search-input" style={{ width: '100%' }} />
            </div>
            <div className="mf-group">
              <label>Priority *</label>
              <select value={newTaskForm.priority} onChange={e => setNewTaskForm(prev => ({ ...prev, priority: e.target.value }))} className="status-selector" style={{ width: '100%', height: '38px' }}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="mf-group">
              <label>Stage *</label>
              <select value={newTaskForm.status} onChange={e => setNewTaskForm(prev => ({ ...prev, status: e.target.value }))} className="status-selector" style={{ width: '100%', height: '38px' }}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="mf-group">
              <label>Detailed Description</label>
              <textarea rows={3} value={newTaskForm.desc} onChange={e => setNewTaskForm(prev => ({ ...prev, desc: e.target.value }))} placeholder="Detail core checklist details here..." className="search-input" style={{ width: '100%', height: 'auto', padding: '8px' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}><Plus size={16} /> Create Task</button>
          </form>
        </div>
      </div>
    </div>
  );
};
