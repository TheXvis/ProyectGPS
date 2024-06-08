import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nombre, setNombre] = useState(''); 
    const [apellido, setApellido] = useState(''); 
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [telefono, setTelefono] = useState('');
    const rutRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i;
    const telefonoRegex = /^9\d{8}$/;


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^[a-zA-Z\s]*$/.test(nombre) || !/^[a-zA-Z\s]*$/.test(apellido)) {
      setErrorMessage("El nombre y apellido solo pueden contener letras y espacios");
      return;
  }
    if (!rutRegex.test(rut)) {
        setErrorMessage("Formato de RUT inválido");
        return;
      }
    
      if (!emailRegex.test(email)) {
        setErrorMessage("Formato de correo electrónico inválido");
        return;
      }
      if (!telefonoRegex.test(telefono)) {
        setErrorMessage("Formato de teléfono inválido");
        return;
    }
    if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rut, password, Nombre: nombre, Apellido: apellido, email, Telefono: telefono}),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log(data);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Registrar Nuevo Usuario
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ingresa aqui tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  id="apellido"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ingresa aqui tu apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="rut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tu Rut
                </label>
                <input
                  type="text"
                  name="rut"
                  id="rut"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ingresa aqui tu rut con el formato (12345678-9)"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ingresa aqui tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
             <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
       Teléfono
  </label>
  <input
    type="tel"
    name="telefono"
    id="telefono"
    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    placeholder="Ingresa aqui tu número de teléfono"
    value={telefono}
    onChange={(e) => setTelefono(e.target.value)}
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
                  placeholder="Ingresa aqui tu contraseña"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Muestra el mensaje de error si existe */}
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Registrarse
              </button>
              <button
                type="button"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={() => navigate('/')}
              >
                Volver
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;