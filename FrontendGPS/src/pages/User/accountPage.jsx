import { useState, useEffect } from 'react';
import axios from 'axios';

function AccountDetails() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Función para normalizar el RUT
  const normalizeRut = (rut) => {
    return rut.replace(/\./g, '').replace(/-/g, '');
  };

  // Obtén los detalles del usuario cuando el componente se monta
  useEffect(() => {
    const fetchUser = async () => {
      const rut = localStorage.getItem('rut');
      const normalizedRut = normalizeRut(rut);
      const response = await axios.get(`http://localhost:3000/user/ver/${normalizedRut}`);
      setUser(response.data);
    };

    fetchUser();
  }, []);

  // Maneja la actualización de los detalles del usuario
  const handleUpdate = async () => {
    try {
      const rut = localStorage.getItem('rut');
      const normalizedRut = normalizeRut(rut);
      const response = await axios.put(`http://localhost:3000/user/editar/${normalizedRut}`, user);
      console.log(response.data);
      alert('Detalles de la cuenta actualizados con éxito');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar los detalles de la cuenta');
    }
  };

  // Maneja el cambio en los campos del formulario
  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  // Si los detalles del usuario aún no se han cargado, muestra un mensaje de carga
  if (!user) {
    return <div>Cargando detalles de la cuenta...</div>;
  }

  // Renderiza el formulario de detalles de la cuenta
  return (
    <div className="max-w-lg mx-auto block mb-2 p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <form className="max-w-sm mx-auto">
        <div>
          <label htmlFor="Nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre:</label>
          <input type="text" id="Nombre" name="Nombre" value={user.Nombre} onChange={handleChange} disabled={!isEditing} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="Apellido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido:</label>
          <input type="text" id="Apellido" name="Apellido" value={user.Apellido} onChange={handleChange} disabled={!isEditing} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="Telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teléfono:</label>
          <input type="text" id="Telefono" name="Telefono" value={user.Telefono} onChange={handleChange} disabled={!isEditing} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
          <input type="text" id="Email" name="Email" value={user.email} onChange={handleChange} disabled={!isEditing} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>

        <button className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancelar' : 'Editar'}</button>
        {isEditing && <button type="button" className="ml-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={handleUpdate}>Actualizar detalles</button>}
      </form>
    </div>
  );
}

export default AccountDetails;
