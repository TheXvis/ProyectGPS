import './App.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/loginPage';
import UserPage from './pages/User/userPage';
import CreatePublication from './pages/User/createPublication';
import SideBar from './components/sideBar';
import PropTypes from 'prop-types';

import MapPage from './pages/Maps/MapOrigenDestino.jsx';
import UserPublicationsPage from './pages/User/misPublicaciones';
import CarrierPage from './pages/carrierPage.jsx';
import AccountPage from './pages/User/accountPage.jsx';
import PublicationDetailsPage from './pages/User/publicationDetailPage.jsx';
import PublicationList from './pages/Carrier/publicationList.jsx';

import PagoPage from './pages/pagoPage';
import RegisterPage from './pages/registerPage';
import MisReviews from './pages/Carrier/misReviews.jsx';


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
          <Route path="/ver-mapa" element={<Layout><MapPage/></Layout>} />
          <Route path="/mis-publicaciones" element={<Layout><UserPublicationsPage/></Layout>} />
          <Route path="/carrierPage" element={<Layout><CarrierPage/></Layout>} />
          <Route path="/accountPage" element={<Layout><AccountPage/></Layout>} />
          <Route path="/registro" element={<RegisterPage/>} /> 
          <Route path="/pago" element={<Layout><PagoPage/></Layout>} />
          <Route path="/publicationlist" element={<PublicationList/>} />
          
          <Route path="/registro" element={<RegisterPage/>} />
          <Route path="/publication/details/:id" element={<Layout><PublicationDetailsPage/></Layout>} />
          <Route path='/misreviews' element={<Layout><MisReviews/></Layout>} />
           
        </Routes>
      </div>
    </Router>
  );
}

export default App;