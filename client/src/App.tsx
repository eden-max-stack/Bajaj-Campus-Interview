import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import DoctorListing from './DoctorListing';

const App: React.FC = () => {
  return (
    <div className='main-content'>
      <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<DoctorListing />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App