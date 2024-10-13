// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainNav from './components/MainNav';
import Registration from './components/Registration';

const App = () => {
    return (
        <Router>
            <MainNav />
            <Routes>
                <Route path="/register" element={<Registration />} />
            </Routes>
        </Router>
    );
};

export default App;
