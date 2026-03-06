import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, FileText, Search, GraduationCap,
    Calendar, Book, ExternalLink, Download,
    ChevronRight, Filter, LayoutGrid, List, PlusCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../data/DataContext';

const Navbar = ({ searchTerm, setSearchTerm }) => (
    <nav className="glass-nav" style={{ position: 'sticky', top: '0', zIndex: 1000, padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                    <GraduationCap size={28} color="white" />
                </div>
                <span style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-1px' }}>UPSC<span className="gradient-text">Master</span></span>
            </Link>
            <div style={{ display: 'flex', gap: '32px', fontWeight: '600', color: 'var(--text-muted)' }}>
                <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Dashboard</Link>
                <a href="#pyqs" style={{ textDecoration: 'none', color: 'inherit' }}>PYQs</a>
                <a href="#notes" style={{ textDecoration: 'none', color: 'inherit' }}>Syllabus Notes</a>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', width: '250px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search across all..."
                        style={{ background: 'none', border: 'none', color: 'white', marginLeft: '10px', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                    />
                </div>
                <Link to="/admin" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    Admin <PlusCircle size={18} />
                </Link>
            </div>
        </div>
    </nav>
);

const Hero = ({ config }) => (
    <section id="hero" style={{ padding: '80px 0', background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15), transparent 70%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <span className="badge badge-indigo" style={{ marginBottom: '24px', padding: '8px 20px', fontSize: '0.85rem' }}>
                    🔥 Premium Preparation Platform
                </span>
                <h1 style={{ fontSize: '5rem', lineHeight: '1', fontWeight: '800', marginBottom: '24px' }}>
                    {config?.name || 'Your Ultimate UPSC Study Hub'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
                    Integrated vault for PYQs, detailed subject notes, and official PDF documents.
                    The most organized way to master Indian Civil Services.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <a href="#pyqs" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
                        Get Started <ChevronRight size={20} />
                    </a>
                    <a href="#notes" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
                        Browse Syllabus
                    </a>
                </div>
            </motion.div>
        </div>
    </section>
);

const SectionTitle = ({ title, subtitle, icon: Icon }) => (
    <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {Icon && <div style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '10px' }}><Icon size={24} /></div>}
            <h2 style={{ fontSize: '2.5rem' }}>{title}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{subtitle}</p>
    </div>
);

const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
        <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
        <h3 style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{message}</h3>
    </div>
);

const PYQSection = ({ searchTerm, config }) => {
    const { data } = useData();
    const [viewMode, setViewMode] = useState('year');
    const [activeFilter, setActiveFilter] = useState(null);

    const subjects = data.subjects;
    const settings = config?.settings || { showYearWise: true, showSubjectWise: true };
    const years = useMemo(() => {
        const ySet = new Set(data.pyqs.map(p => p.year));
        return Array.from(ySet).sort((a, b) => b - a);
    }, [data.pyqs]);

    const displayYear = (y) => y === 0 ? "Subject-wise Files" : y;

    // Default view mode based on settings
    useMemo(() => {
        if (!settings.showYearWise && viewMode === 'year') setViewMode('subject');
        if (!settings.showSubjectWise && viewMode === 'subject') setViewMode('year');
    }, [settings]);

    useMemo(() => {
        if (!activeFilter || (!years.includes(parseInt(activeFilter)) && !subjects.includes(activeFilter) && activeFilter !== "Subject-wise Files")) {
            if (viewMode === 'year' && years.length > 0) {
                const defaultYear = years.find(y => y > 0) ?? 0;
                setActiveFilter(defaultYear === 0 ? "Subject-wise Files" : defaultYear);
            } else if (viewMode === 'subject' && subjects.length > 0) {
                setActiveFilter(subjects[0]);
            }
        }
    }, [viewMode, years, subjects, activeFilter]);

    const filteredQuestions = useMemo(() => {
        let base = [];
        if (viewMode === 'year') {
            const targetYear = activeFilter === "Subject-wise Files" ? 0 : parseInt(activeFilter);
            const paper = data.pyqs.find(p => p.year === targetYear);
            base = paper ? paper.questions : [];
        } else {
            data.pyqs.forEach(p => {
                p.questions.forEach(q => {
                    if (q.subject === activeFilter) {
                        base.push({ ...q, year: p.year });
                    }
                });
            });
        }

        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            return base.filter(q =>
                q.text.toLowerCase().includes(lowSearch) ||
                q.topic?.toLowerCase().includes(lowSearch) ||
                q.subject?.toLowerCase().includes(lowSearch)
            );
        }
        return base;
    }, [viewMode, activeFilter, data.pyqs, searchTerm]);

    return (
        <section id="pyqs" className="container" style={{ padding: '100px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <SectionTitle
                    title={config?.name || "PYQ Vault"}
                    subtitle={searchTerm ? `Search results for "${searchTerm}"` : "Explore years of knowledge with structured filtering."}
                    icon={FileText}
                />

                {settings.showYearWise && settings.showSubjectWise && (
                    <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '40px' }}>
                        <button
                            onClick={() => setViewMode('year')}
                            className={`sidebar-item ${viewMode === 'year' ? 'active' : ''}`}
                            style={{ padding: '10px 24px', borderRadius: '10px' }}
                        >
                            <Calendar size={18} /> Year-wise
                        </button>
                        <button
                            onClick={() => setViewMode('subject')}
                            className={`sidebar-item ${viewMode === 'subject' ? 'active' : ''}`}
                            style={{ padding: '10px 24px', borderRadius: '10px' }}
                        >
                            <Book size={18} /> Subject-wise
                        </button>
                    </div>
                )}
            </div>

            <div className="layout-with-sidebar">
                <aside className="sidebar">
                    <div style={{ padding: '0 0 16px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {viewMode === 'year' ? 'Navigation' : 'Syllabus Areas'}
                        </span>
                    </div>
                    {(viewMode === 'year' ? years : subjects).map(item => (
                        <div
                            key={item}
                            className={`sidebar-item ${activeFilter === (item === 0 ? "Subject-wise Files" : item) ? 'active' : ''}`}
                            onClick={() => setActiveFilter(item === 0 ? "Subject-wise Files" : item)}
                        >
                            <ChevronRight size={16} />
                            {displayYear(item)}
                        </div>
                    ))}
                </aside>

                <main>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100%, 1fr))', gap: '24px' }}>
                        <AnimatePresence mode="popLayout">
                            {filteredQuestions.length > 0 ? filteredQuestions.map((q, idx) => (
                                <motion.div
                                    layout
                                    key={q.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="premium-card"
                                    style={{ padding: '32px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <span className="badge badge-emerald">{q.type || 'Prelims'}</span>
                                            <span className="badge badge-indigo">{q.subject}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '20px' }}>{q.topic}</span>
                                        </div>
                                        {q.contentType === 'link' && <a href={q.link} target="_blank" rel="noreferrer" className="gradient-text"><ExternalLink size={20} /></a>}
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '24px', lineHeight: '1.5' }}>{q.text}</h3>

                                    {q.contentType === 'manual' ? (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                                {q.options?.map((opt, i) => (
                                                    <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1rem' }}>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', marginRight: '12px' }}>{String.fromCharCode(65 + i)}.</span> {opt}
                                                    </div>
                                                ))}
                                            </div>
                                            <details className="premium-card" style={{ background: 'rgba(99, 102, 241, 0.03)', border: 'none' }}>
                                                <summary style={{ padding: '16px', cursor: 'pointer', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    Check Answer & Reasoning <ChevronRight size={18} />
                                                </summary>
                                                <div style={{ padding: '0 16px 20px', fontSize: '1.05rem' }}>
                                                    <div style={{ padding: '16px', background: 'var(--bg-dark)', borderRadius: '10px', borderLeft: '4px solid var(--success)' }}>
                                                        <p style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--success)' }}>CORRECT ANSWER: {q.answer}</p>
                                                        <p style={{ color: 'var(--text-muted)' }}>{q.explanation}</p>
                                                    </div>
                                                </div>
                                            </details>
                                        </>
                                    ) : (
                                        <div style={{ background: 'var(--bg-dark)', borderRadius: '16px', padding: '32px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                                            <FileText size={40} color="var(--primary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Subject-expert material available as a high-quality document.</p>
                                            <a href={q.link} target="_blank" rel="noreferrer" className="btn btn-primary">
                                                <Download size={18} /> Download Resource PDF
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            )) : (
                                <EmptyState message={`No questions found matching "${searchTerm}" under this filter.`} />
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </section>
    );
};

const NotesSection = ({ searchTerm, config }) => {
    const { data } = useData();
    const [activeSubject, setActiveSubject] = useState(data.subjects[0]);

    const filteredNotes = useMemo(() => {
        const base = data.notes.filter(n => n.subject === activeSubject);
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            return base.filter(n =>
                n.title.toLowerCase().includes(lowSearch) ||
                n.summary?.toLowerCase().includes(lowSearch) ||
                n.topic?.toLowerCase().includes(lowSearch)
            );
        }
        return base;
    }, [activeSubject, data.notes, searchTerm]);

    // Fallback if active subject is deleted
    useMemo(() => {
        if (!data.subjects.includes(activeSubject) && data.subjects.length > 0) {
            setActiveSubject(data.subjects[0]);
        }
    }, [data.subjects, activeSubject]);

    return (
        <section id="notes" style={{ padding: '100px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div className="container">
                <SectionTitle
                    title={config?.name || "Syllabus Notes"}
                    subtitle={searchTerm ? `Searching notes for "${searchTerm}"...` : "Deep dive into key concepts across the UPSC syllabus."}
                    icon={BookOpen}
                />

                <div className="layout-with-sidebar">
                    {config?.settings?.showSidebar !== false && (
                        <aside className="sidebar">
                            {data.subjects.map(sub => (
                                <div
                                    key={sub}
                                    className={`sidebar-item ${activeSubject === sub ? 'active' : ''}`}
                                    onClick={() => setActiveSubject(sub)}
                                >
                                    <BookOpen size={18} />
                                    {sub}
                                </div>
                            ))}
                        </aside>
                    )}

                    <main style={{ flex: config?.settings?.showSidebar === false ? 1 : 'initial' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                            <AnimatePresence mode="popLayout">
                                {filteredNotes.length > 0 ? filteredNotes.map((note, idx) => (
                                    <motion.div
                                        layout
                                        key={note.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="premium-card"
                                        style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <span className="badge badge-amber" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>{note.topic}</span>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '20px', lineHeight: '1.2' }}>{note.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', flex: 1, fontSize: '1.05rem' }}>
                                            {note.summary || (note.content ? note.content.substring(0, 120) + '...' : 'Premium material available.')}
                                        </p>
                                        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {note.contentType === 'link' ? (
                                                <a href={note.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }} className="btn btn-outline">
                                                    View PDF <ExternalLink size={16} />
                                                </a>
                                            ) : (
                                                <button className="btn btn-outline">
                                                    Read More <ChevronRight size={16} />
                                                </button>
                                            )}
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5 min read</span>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <EmptyState message={`No notes found matching "${searchTerm}" for this subject.`} />
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

const UserPortal = () => {
    const { data } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const sections = useMemo(() => {
        return [...(data.uiConfig?.sections || [])].sort((a, b) => a.order - b.order);
    }, [data.uiConfig]);

    const renderSection = (section) => {
        if (!section.visible) return null;

        switch (section.id) {
            case 'hero':
                return <Hero key="hero" config={section} />;
            case 'pyqs':
                return <PYQSection key="pyqs" searchTerm={searchTerm} config={section} />;
            case 'notes':
                return <NotesSection key="notes" searchTerm={searchTerm} config={section} />;
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main>
                {sections.map(renderSection)}
            </main>

            <footer style={{ background: 'var(--bg-card)', padding: '80px 0', borderTop: '1px solid var(--border-color)', marginTop: '100px' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '10px' }}>
                                <GraduationCap size={24} color="white" />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>UPSC<span className="gradient-text">Master</span></span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
                            India's most organized preparation platform for UPSC aspirants.
                            Built for efficiency, clarity, and success.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', color: 'var(--text-muted)', display: 'grid', gap: '12px' }}>
                            <li>Dashboard</li>
                            <li>PYQ Vault</li>
                            <li>Syllabus Notes</li>
                            <li>Current Affairs</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '20px' }}>Support</h4>
                        <ul style={{ listStyle: 'none', color: 'var(--text-muted)', display: 'grid', gap: '12px' }}>
                            <li>Help Center</li>
                            <li>Contact Us</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>
                <div className="container" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    © 2026 UPSCMaster. Inspired by the best, built for the winners.
                </div>
            </footer>
        </div>
    );
};

export default UserPortal;
