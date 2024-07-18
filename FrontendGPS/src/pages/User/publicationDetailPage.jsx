import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EditPublicationForm from '../../components/userComponents/editPublicationForm';


function PublicationDetailsPage() {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublication = async () => {
      const response = await fetch(`http://localhost:3000/publication/buscar/${id}`);
      const data = await response.json();
      setPublication(data);
    };

    fetchPublication();
  }, [id]);

  const deletePublication = async () => {
    const response = await fetch(`http://localhost:3000/publication/borrar/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
        navigate('/usuario-home');
    } else {
      alert('Error al eliminar la publicación');
    }
  };

  const aceptarPublicacion = async () => {
    const carrierRut = localStorage.getItem('rut'); // Asumiendo que el RUT del transportista se guarda con la clave 'rut'
    const response = await fetch(`http://localhost:3000/carrier/aceptar/${id}/${carrierRut}`, {
      method: 'PUT',
    });

    if (response.ok) {
      alert('Publicación aceptada con éxito');
    } else {
      alert('Error al aceptar la publicación');
    }
  };

  const cancelarPublicacion = async() => {
    const response = await fetch(`http://localhost:3000/publication/cancelar/${id}`, {
      method: 'PUT',
    })
      if (response.ok) {
        alert('Publicación aceptada con éxito');
      } else {
        alert('Error al aceptar la publicación');
      }
    }


  if (!publication) {
    return <div>Loading...</div>;
  }
  return (
    <div className=" flex-col justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sm:p-10 inline-block text-center">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{publication.nombre}</h5>
        <img src={`http://localhost:3000/${publication.imagen}`} alt={publication.nombre} className="mx-auto w-1/4 mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400"  />
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Inicio: {publication.ubicacionCarga}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Destino: {publication.ubicacionDescarga}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Precio: {publication.precio}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Tipo de mercancia: {publication.tipoMercancia}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Peso: {publication.peso}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Estado: {publication.estado}</p>
        {userRole === 'user' && (
        <>
          <button onClick={deletePublication} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Eliminar publicación</button>
          <div>
            <EditPublicationForm/>
          </div>
        </>
        )}
        {userRole === 'carrier' && (
          <>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={aceptarPublicacion}>Aceptar Publicación</button>
          </>
          
        )}

      </div>
      {userRole === 'user' && publication.rutCarrier.trim() !== '' &&(
    <div className="justify-center  bg-white dark:bg-gray-800 p-2 shadow inline-block text-center mt-4 ml-21 items-center">
      <div>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">RUT del Carrier: {publication.rutCarrier}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Nombre: {publication.nombreCarrier}</p>
        <button onClick={cancelarPublicacion} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
      </div>
    </div>
  )}
    </div>
    
  );
}

export default PublicationDetailsPage;