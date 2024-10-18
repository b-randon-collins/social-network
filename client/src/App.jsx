// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainNav from './components/MainNav';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import Registration from './pages/Registration';
import UserEditForm from './pages/UserEditForm';
import Activities from './pages/Activities';

const App = () => {
  const user = useSelector(state => state.user.user);

  return (
    <Router>
      <MainNav />
      <Routes>
        <Route 
          path="/" 
          element={user?.id ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/welcome" 
          element={user?.id ? <Welcome /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!user?.id ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!user?.id ? <Registration /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={user?.id ? <UserEditForm /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/activities" 
          element={user?.id ? <Activities /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
