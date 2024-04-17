import './App.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/loginPage';
import UserPage from './pages/userPage';
import CreatePublication from './components/createPublication';
import SideBar from './components/sideBar';


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
      <div className=" dark:bg-gray-900 min-h-screen">
        <header>
          <Redirector />
        </header>
        <SideBar />
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/usuario-home" element={<UserPage/>} />
          <Route path="/crear-publicacion" element={<CreatePublication/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;