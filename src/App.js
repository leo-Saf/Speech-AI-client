// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import MinHistoria from './components/MinHistoria';
import About from './components/About';
import './style.css'; // Importera din CSS-fil

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/min-historia">Min Historia</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/min-historia" element={<MinHistoria />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
