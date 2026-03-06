import React, { createContext, useContext, useState, useEffect } from 'react';
import { UPSC_DATA as INITIAL_DATA } from './upsc';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('upsc_master_data');
        const defaultUI = {
            sections: [
                { id: 'hero', name: 'Hero Section', visible: true, order: 0, settings: {} },
                {
                    id: 'pyqs',
                    name: 'PYQ Vault',
                    visible: true,
                    order: 1,
                    settings: { showYearWise: true, showSubjectWise: true }
                },
                {
                    id: 'notes',
                    name: 'Syllabus Notes',
                    visible: true,
                    order: 2,
                    settings: { showSidebar: true }
                }
            ]
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.subjects) parsed.subjects = ["Polity", "Economy", "History", "Geography", "Environment"];
            if (!parsed.uiConfig) parsed.uiConfig = defaultUI;
            return parsed;
        }
        return {
            ...INITIAL_DATA,
            subjects: ["Polity", "Economy", "History", "Geography", "Environment"],
            uiConfig: defaultUI
        };
    });

    useEffect(() => {
        localStorage.setItem('upsc_master_data', JSON.stringify(data));
    }, [data]);

    const addSubject = (name) => {
        setData(prev => ({
            ...prev,
            subjects: [...new Set([...prev.subjects, name])]
        }));
    };

    const deleteSubject = (name) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s !== name)
        }));
    };

    const reorderSubjects = (newSubjects) => {
        setData(prev => ({
            ...prev,
            subjects: newSubjects
        }));
    };

    const addPYQ = (year, question) => {
        setData(prev => {
            const newData = { ...prev };
            const targetYear = year ? parseInt(year) : 0; // 0 represents "General/Subject-wise"
            const paperIndex = newData.pyqs.findIndex(p => p.year === targetYear);

            if (paperIndex > -1) {
                newData.pyqs[paperIndex].questions.push(question);
            } else {
                newData.pyqs.push({
                    id: Date.now(),
                    year: targetYear,
                    paper: targetYear === 0 ? "Subject-wise Resources" : "General Studies I",
                    questions: [question]
                });
            }
            return { ...newData };
        });
    };

    const deletePYQ = (pyqId) => {
        setData(prev => {
            const newData = { ...prev };
            newData.pyqs = newData.pyqs.map(p => ({
                ...p,
                questions: p.questions.filter(q => q.id !== pyqId)
            })).filter(p => p.questions.length > 0);
            return newData;
        });
    };

    const addNote = (note) => {
        setData(prev => ({
            ...prev,
            notes: [...prev.notes, { ...note, id: 'n' + Date.now() }]
        }));
    };

    const deleteNote = (noteId) => {
        setData(prev => ({
            ...prev,
            notes: prev.notes.filter(n => n.id !== noteId)
        }));
    };

    const updateUIConfig = (newConfig) => {
        setData(prev => ({
            ...prev,
            uiConfig: newConfig
        }));
    };

    const resetData = () => {
        const defaultData = {
            ...INITIAL_DATA,
            subjects: ["Polity", "Economy", "History", "Geography", "Environment"],
            uiConfig: {
                sections: [
                    { id: 'hero', name: 'Hero Section', visible: true, order: 0, settings: {} },
                    {
                        id: 'pyqs',
                        name: 'PYQ Vault',
                        visible: true,
                        order: 1,
                        settings: { showYearWise: true, showSubjectWise: true }
                    },
                    {
                        id: 'notes',
                        name: 'Syllabus Notes',
                        visible: true,
                        order: 2,
                        settings: { showSidebar: true }
                    }
                ]
            }
        };
        setData(defaultData);
        localStorage.removeItem('upsc_master_data');
    };

    return (
        <DataContext.Provider value={{
            data, addPYQ, deletePYQ, addNote, deleteNote,
            addSubject, deleteSubject, reorderSubjects,
            updateUIConfig, resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
