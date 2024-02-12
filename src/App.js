import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/loginPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={ <LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
