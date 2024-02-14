import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/loginPage';
import UserGridComponent from './components/userGridComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user-grid" element={<UserGridComponent />} /> {/* Add element prop */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
