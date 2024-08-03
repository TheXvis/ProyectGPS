import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleRutChange = (e) => {
    const value = e.target.value.replace(/\./g, '').replace('-', ''); // Remove dots and hyphen
    const formattedRut = formatRut(value);
    setRut(formattedRut);
  };

  const formatRut = (rut) => {
    if (!rut) return '';
    let rutBody = rut.slice(0, -1);
    let rutDv = rut.slice(-1);
    rutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${rutBody}-${rutDv}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rut.replace(/\./g, '').replace('-', ''), password }), // Enviar RUT sin puntos ni guiones
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('Rol devuelto por el backend:', data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('rut', rut);

        const userType = localStorage.getItem('role');
        console.log('Rol almacenado en localStorage:', userType);
        if (userType === 'user' || userType === 'admin') {
          navigate('/usuario-home');
        }
        if (userType === 'carrier') {
          navigate('/usuario-home');
        }
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Por favor inicia sesión
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="rut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tu Rut
                </label>
                <input
                  type="text"
                  name="rut"
                  id="rut"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ingresa aquí tu rut"
                  value={rut}
                  onChange={handleRutChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Ingresa aquí tu contraseña"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Iniciar sesión
              </button>
              <Link
                to="/registro"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 block mt-4"
              >
                Registrarse
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;