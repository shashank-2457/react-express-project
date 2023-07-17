import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/Form';
import Summary from './components/Summary';
import HomePage from './components/HomePage';
import Registration from './components/Registration';
import Login from './components/Login';

function App() {
  const [formData, setFormData] = useState(null);
  const [billPictureUrl, setBillPictureUrl] = useState(null);

  const handleFormSubmit = (data, billPictureUrl) => {
    setFormData(data);
    setBillPictureUrl(billPictureUrl);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/form"
            element={<Form handleFormSubmit={handleFormSubmit} />}
          />
          <Route
            path="/summary"
            element={<Summary formData={formData} billPictureUrl={billPictureUrl} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
