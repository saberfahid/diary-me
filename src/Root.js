import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import EntryPage from './components/EntryPage';

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/entry/:id" element={<EntryPage />} />
      </Routes>
    </Router>
  );
}

export default Root;
