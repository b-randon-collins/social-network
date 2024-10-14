// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNav from './components/MainNav';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import Registration from './pages/Registration';

const App = () => {
  return (
    <Router>
      <MainNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
};

export default App;
