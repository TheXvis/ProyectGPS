import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage';

function App() {
  return (
    <Router>
      <div>
        <header>
          <Routes>
            <Route path="/" element={<LoginPage/>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App
