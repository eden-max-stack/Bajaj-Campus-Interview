import React from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import DoctorListing from './DoctorListing';

const App: React.FC = () => {
  return (
    <div>
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