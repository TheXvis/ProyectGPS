import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EditPublicationForm from '../../components/userComponents/editPublicationForm';


function PublicationDetailsPage() {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
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

  if (!publication) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sm:p-10 inline-block text-center">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{publication.nombre}</h5>
        <img src={`http://localhost:3000/${publication.imagen}`} alt={publication.nombre} className="mx-auto w-1/4 mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400"  />
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Ubicacion: {publication.ubicacion}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Precio: {publication.precio}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Tipo de mercancia: {publication.tipoMercancia}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Peso: {publication.peso}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Estado: {publication.estado}</p>
        <button onClick={deletePublication} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Eliminar publicación</button>
        <div>
          <EditPublicationForm/>
        </div>
      </div>
    </div>
  );
}

export default PublicationDetailsPage;