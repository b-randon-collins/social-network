// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNav from './components/MainNav';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import Registration from './pages/Registration';
import UserEditForm from './pages/UserEditForm';

const App = () => {

  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      window.location.href = 'http://localhost:5173';
    }
  }, []);

  return (
    <Router>
      <MainNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<UserEditForm />} />
      </Routes>
    </Router>
  );
};

export default App;
