import './App.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import UserPage from './pages/userPage';

function Redirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'Usuario') {
      navigate('/usuario-home');
    }
    // Agrega aquí la lógica para otros tipos de usuario
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <div>
        <header>
          <Redirector />
          <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/usuario-home" element={<UserPage/>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;