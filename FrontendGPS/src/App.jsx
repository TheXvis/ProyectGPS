import './App.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/loginPage';
import UserPage from './pages/userPage';
import CreatePublication from './components/createPublication';
import SideBar from './components/sideBar';
import PropTypes from 'prop-types';
import CarrierPage from './pages/carrierPage.jsx';

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

function Layout({ children }) {
  return (
    <>
      <SideBar />
      {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <div className=" dark:bg-gray-900 min-h-screen">
        <header>
          <Redirector />
        </header>
        <Routes>
        <Route path="/" element={<LoginPage/>} />
          <Route path="/usuario-home" element={<Layout><UserPage/></Layout>} />
          <Route path="/crear-publicacion" element={<Layout><CreatePublication/></Layout>} />
          <Route path="/carrierPage" element={<CarrierPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;