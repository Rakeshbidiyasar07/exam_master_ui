import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../data/DataContext';
import {
    PlusCircle, Save, RotateCcw, FileText,
    BookOpen, Link as LinkIcon, Plus,
    GraduationCap, Home, BarChart3, Settings,
    Hash, Layers, CheckCircle2, AlertCircle,
    Eye, EyeOff, ArrowUp, ArrowDown, Layout,
    Trash2, Edit3, Search, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPortal = () => {
    const { data, addPYQ, deletePYQ, addNote, deleteNote, addSubject, deleteSubject, reorderSubjects, updateUIConfig, resetData } = useData();
    const [activeTab, setActiveTab] = useState('pyq');
    const [newSubjectName, setNewSubjectName] = useState('');
    const [contentSearch, setContentSearch] = useState('');

    const [pyqForm, setPyqForm] = useState({
        year: '',
        subject: data.subjects[0],
        topic: '',
        text: '',
        options: ['', '', '', ''],
        answer: '',
        explanation: '',
        type: 'Prelims',
        contentType: 'link',
        link: ''
    });

    const [noteForm, setNoteForm] = useState({
        subject: data.subjects[0],
        topic: '',
        title: '',
        summary: '',
        content: '',
        contentType: 'manual',
        link: ''
    });

    const handlePyqSubmit = (e) => {
        e.preventDefault();
        addPYQ(pyqForm.year, {
            id: 'q' + Date.now(),
            ...pyqForm
        });
        alert('Content Published!');
        setPyqForm({ ...pyqForm, text: '', topic: '', answer: '', explanation: '', options: ['', '', '', ''], link: '' });
    };

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        addNote(noteForm);
        alert('Study Material Added!');
        setNoteForm({ ...noteForm, title: '', summary: '', content: '', topic: '', link: '' });
    };

    // Layout Manager Logic
    const sections = data.uiConfig?.sections || [];

    const moveSection = (index, direction) => {
        const sortedSections = [...sections].sort((a, b) => a.order - b.order);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < sortedSections.length) {
            const tempOrder = sortedSections[index].order;
            sortedSections[index].order = sortedSections[targetIndex].order;
            sortedSections[targetIndex].order = tempOrder;
            updateUIConfig({ ...data.uiConfig, sections: sortedSections });
        }
    };

    const updateSectionSetting = (id, key, value) => {
        const newSections = sections.map(s =>
            s.id === id ? { ...s, settings: { ...s.settings, [key]: value } } : s
        );
        updateUIConfig({ ...data.uiConfig, sections: newSections });
    };

    const toggleVisibility = (id) => {
        const newSections = sections.map(s =>
            s.id === id ? { ...s, visible: !s.visible } : s
        );
        updateUIConfig({ ...data.uiConfig, sections: newSections });
    };

    // Subject Management
    const moveSubject = (index, direction) => {
        const newSubjects = [...data.subjects];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newSubjects.length) {
            const temp = newSubjects[index];
            newSubjects[index] = newSubjects[targetIndex];
            newSubjects[targetIndex] = temp;
            reorderSubjects(newSubjects);
        }
    };

    // Content Flattening for Management
    const allPyqs = data.pyqs.flatMap(p => p.questions.map(q => ({ ...q, year: p.year })));
    const filteredPyqs = allPyqs.filter(q => q.text.toLowerCase().includes(contentSearch.toLowerCase()) || q.subject.toLowerCase().includes(contentSearch.toLowerCase()));
    const filteredNotes = data.notes.filter(n => n.title.toLowerCase().includes(contentSearch.toLowerCase()) || n.subject.toLowerCase().includes(contentSearch.toLowerCase()));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Admin Navbar */}
            <nav className="glass-nav" style={{ position: 'sticky', top: '0', zIndex: 1000, padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }} title="View Public Site">
                            <ExternalLink size={20} /> <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Live Site</span>
                        </Link>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Admin <span className="gradient-text">Dashboard</span></h1>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button onClick={resetData} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderColor: 'var(--danger)', padding: '8px 16px' }}>
                            <RotateCcw size={16} /> Reset All
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ padding: '40px 0' }}>
                <div className="layout-with-sidebar">
                    {/* Admin Sidebar */}
                    <aside className="sidebar">
                        <div style={{ marginBottom: '32px' }}>
                            <span className="badge badge-indigo" style={{ marginBottom: '16px' }}>General</span>
                            <div className={`sidebar-item ${activeTab === 'pyq' ? 'active' : ''}`} onClick={() => setActiveTab('pyq')}><FileText size={20} /> Upload PYQ</div>
                            <div className={`sidebar-item ${activeTab === 'note' ? 'active' : ''}`} onClick={() => setActiveTab('note')}><BookOpen size={20} /> Upload Notes</div>
                            <div className={`sidebar-item ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}><Layers size={20} /> Content Manager</div>
                            <div className={`sidebar-item ${activeTab === 'layout' ? 'active' : ''}`} onClick={() => setActiveTab('layout')}><Layout size={20} /> Layout Manager</div>
                        </div>

                        <div className="premium-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <Hash size={18} color="var(--primary)" />
                                <h4 style={{ fontSize: '1.1rem' }}>Syllabus Manager</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                                {data.subjects.map((s, idx) => (
                                    <div key={idx} className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(0,0,0,0.2)', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <button onClick={() => moveSubject(idx, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? 'transparent' : 'white', cursor: 'pointer', padding: 0 }}><ArrowUp size={12} /></button>
                                                <button onClick={() => moveSubject(idx, 'down')} disabled={idx === data.subjects.length - 1} style={{ background: 'none', border: 'none', color: idx === data.subjects.length - 1 ? 'transparent' : 'white', cursor: 'pointer', padding: 0 }}><ArrowDown size={12} /></button>
                                            </div>
                                            {s}
                                        </div>
                                        <button onClick={() => deleteSubject(s)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.6 }}><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    value={newSubjectName}
                                    onChange={e => setNewSubjectName(e.target.value)}
                                    placeholder="Add subject..."
                                    style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', padding: '10px', fontSize: '0.85rem', outline: 'none' }}
                                />
                                <button onClick={() => { if (newSubjectName) { addSubject(newSubjectName); setNewSubjectName(''); } }} className="btn btn-primary" style={{ padding: '8px' }}>
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Areas */}
                    <main>
                        <AnimatePresence mode="wait">
                            {activeTab === 'pyq' && (
                                <motion.div key="pyq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="premium-card" style={{ padding: '48px' }}>
                                    <SectionTitle title="Publish PYQ" subtitle="Add manual questions or external PDF links." icon={PlusCircle} />
                                    <form onSubmit={handlePyqSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', width: 'fit-content', marginBottom: '24px' }}>
                                                <button type="button" onClick={() => setPyqForm({ ...pyqForm, contentType: 'manual' })} className={`btn ${pyqForm.contentType === 'manual' ? 'btn-primary' : 'btn-outline'}`} style={{ border: 'none' }}>Manual Text</button>
                                                <button type="button" onClick={() => setPyqForm({ ...pyqForm, contentType: 'link' })} className={`btn ${pyqForm.contentType === 'link' ? 'btn-primary' : 'btn-outline'}`} style={{ border: 'none' }}>PDF Link</button>
                                            </div>
                                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700' }}>Question / Material Header</label>
                                            <textarea required value={pyqForm.text} onChange={e => setPyqForm({ ...pyqForm, text: e.target.value })} style={{ width: '100%', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', minHeight: '100px', outline: 'none' }} />
                                        </div>
                                        {pyqForm.contentType === 'link' && <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '12px', fontWeight: '700' }}>Link URL</label><input required value={pyqForm.link} onChange={e => setPyqForm({ ...pyqForm, link: e.target.value })} style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }} /></div>}
                                        <div style={{ display: 'grid', gap: '8px' }}><label>Year (Optional)</label><input type="number" value={pyqForm.year} onChange={e => setPyqForm({ ...pyqForm, year: e.target.value })} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }} /></div>
                                        <div style={{ display: 'grid', gap: '8px' }}><label>Subject</label><select value={pyqForm.subject} onChange={e => setPyqForm({ ...pyqForm, subject: e.target.value })} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>{data.subjects.map(s => <option key={s}>{s}</option>)}</select></div>
                                        <div style={{ display: 'grid', gap: '8px' }}><label>Topic</label><input required value={pyqForm.topic} onChange={e => setPyqForm({ ...pyqForm, topic: e.target.value })} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }} /></div>
                                        <div style={{ display: 'grid', gap: '8px' }}><label>Type</label><select value={pyqForm.type} onChange={e => setPyqForm({ ...pyqForm, type: e.target.value })} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}><option>Prelims</option><option>Mains</option></select></div>
                                        {pyqForm.contentType === 'manual' && (
                                            <div style={{ gridColumn: 'span 2', display: 'grid', gap: '20px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>{pyqForm.options.map((opt, i) => <input key={i} required value={opt} onChange={e => { const n = [...pyqForm.options]; n[i] = e.target.value; setPyqForm({ ...pyqForm, options: n }); }} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px' }} placeholder={`Option ${String.fromCharCode(65 + i)}`} />)}</div>
                                                <input required value={pyqForm.answer} onChange={e => setPyqForm({ ...pyqForm, answer: e.target.value })} placeholder="Official Answer Key" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }} />
                                                <textarea required value={pyqForm.explanation} onChange={e => setPyqForm({ ...pyqForm, explanation: e.target.value })} placeholder="Detailed Explanation..." style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', minHeight: '100px' }} />
                                            </div>
                                        )}
                                        <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '18px', justifyContent: 'center' }}><CheckCircle2 size={20} /> Publish to Vault</button>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'manage' && (
                                <motion.div key="manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="premium-card" style={{ padding: '48px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                        <SectionTitle title="Content Manager" subtitle="Listing all uploaded materials and questions." icon={Layers} />
                                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', width: '300px' }}>
                                            <Search size={18} color="var(--text-muted)" />
                                            <input value={contentSearch} onChange={e => setContentSearch(e.target.value)} placeholder="Search content..." style={{ background: 'none', border: 'none', color: 'white', marginLeft: '10px', outline: 'none', fontSize: '0.9rem', width: '100%' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '40px' }}>
                                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="var(--primary)" /> PYQs & Resource Files</h4>
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            {filteredPyqs.map(q => (
                                                <div key={q.id} className="premium-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                                            <span className="badge badge-emerald" style={{ fontSize: '0.6rem' }}>{q.year || 'No Year'}</span>
                                                            <span className="badge badge-indigo" style={{ fontSize: '0.6rem' }}>{q.subject}</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>{q.text}</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <button onClick={() => deletePYQ(q.id)} className="btn" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '8px' }}><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={18} color="var(--secondary)" /> Study Notes</h4>
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            {filteredNotes.map(n => (
                                                <div key={n.id} className="premium-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <span className="badge badge-amber" style={{ fontSize: '0.6rem', marginBottom: '4px' }}>{n.subject}</span>
                                                        <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>{n.title}</p>
                                                    </div>
                                                    <button onClick={() => deleteNote(n.id)} className="btn" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '8px' }}><Trash2 size={18} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'note' && (
                                <motion.div key="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="premium-card" style={{ padding: '48px' }}>
                                    <SectionTitle title="Publish Notes" subtitle="Create study material for aspirants." icon={BookOpen} />
                                    <form onSubmit={handleNoteSubmit} style={{ display: 'grid', gap: '32px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <select value={noteForm.subject} onChange={e => setNoteForm({ ...noteForm, subject: e.target.value })} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>{data.subjects.map(s => <option key={s}>{s}</option>)}</select>
                                            <input required value={noteForm.topic} onChange={e => setNoteForm({ ...noteForm, topic: e.target.value })} placeholder="Topic (e.g. Modern India)" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }} />
                                            <input required value={noteForm.title} onChange={e => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="Title" style={{ gridColumn: 'span 2', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }} />
                                        </div>
                                        <textarea required value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })} placeholder="Content Body..." style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', minHeight: '300px' }} />
                                        <button type="submit" className="btn btn-primary" style={{ padding: '18px', justifyContent: 'center' }}><PlusCircle size={20} /> Publish Notes</button>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'layout' && (
                                <motion.div key="layout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="premium-card" style={{ padding: '48px' }}>
                                    <SectionTitle title="Layout Manager" subtitle="Control section order and visibility." icon={Layout} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {[...sections].sort((a, b) => a.order - b.order).map((s, idx) => (
                                            <React.Fragment key={s.id}>
                                                <div className="premium-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: s.visible ? 'rgba(99, 102, 241, 0.05)' : 'rgba(0,0,0,0.2)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} style={{ color: idx === 0 ? 'transparent' : 'white', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowUp size={18} /></button>
                                                            <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} style={{ color: idx === sections.length - 1 ? 'transparent' : 'white', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowDown size={18} /></button>
                                                        </div>
                                                        <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>{s.name}</span>
                                                    </div>
                                                    <button onClick={() => toggleVisibility(s.id)} className={`btn ${s.visible ? 'btn-primary' : 'btn-outline'}`}>{s.visible ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                                                </div>
                                                {s.visible && s.settings && Object.keys(s.settings).length > 0 && (
                                                    <div style={{ marginLeft: '60px', marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '2px solid var(--primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                        {s.id === 'pyqs' && (
                                                            <>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <input type="checkbox" checked={s.settings.showYearWise} onChange={(e) => updateSectionSetting(s.id, 'showYearWise', e.target.checked)} />
                                                                    <label style={{ fontSize: '0.85rem' }}>Show Year-wise Filter</label>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <input type="checkbox" checked={s.settings.showSubjectWise} onChange={(e) => updateSectionSetting(s.id, 'showSubjectWise', e.target.checked)} />
                                                                    <label style={{ fontSize: '0.85rem' }}>Show Subject-wise Filter</label>
                                                                </div>
                                                            </>
                                                        )}
                                                        {s.id === 'notes' && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <input type="checkbox" checked={s.settings.showSidebar} onChange={(e) => updateSectionSetting(s.id, 'showSidebar', e.target.checked)} />
                                                                <label style={{ fontSize: '0.85rem' }}>Show Subject Sidebar</label>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

const SectionTitle = ({ title, subtitle, icon: Icon }) => (
    <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {Icon && <div style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '10px' }}><Icon size={24} /></div>}
            <h2 style={{ fontSize: '2rem' }}>{title}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
);

export default AdminPortal;
