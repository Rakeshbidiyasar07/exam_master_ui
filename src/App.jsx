import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './data/DataContext';
import UserPortal from './components/UserPortal';
import AdminPortal from './components/AdminPortal';

function App() {
  return (
    <DataProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<UserPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
