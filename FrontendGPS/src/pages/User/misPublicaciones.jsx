import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserPublicationsPage() {
  const [publications, setPublications] = useState([]);
  const navigate = useNavigate();
  // Función para normalizar el RUT
  const normalizeRut = (rut) => {
    return rut.replace(/\./g, '').replace(/-/g, '');
  };

  useEffect(() => {
    const fetchPublications = async () => {
      const rut = localStorage.getItem('rut');
      const normalizedRut = normalizeRut(rut);
      const response = await fetch(`http://localhost:3000/publication/ver/${normalizedRut}`);
      const data = await response.json();
      setPublications(data);
    };

    fetchPublications();
  }, []);

  return (
    <div className="p-4 ml-64">
        {publications.map((publication) => (
            <a key={publication._id} href={`/publication/details/${publication._id}`} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-2">
                <img className="object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" style={{ width: '50%', height: '200px', objectFit: 'cover' }} src={`http://localhost:3000/${publication.imagen}`} alt={publication.title} />
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{publication.nombre}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.ubicacion}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.estado}</p>
                    {publication.estado === "En transito" && (
                        <button
                            onClick={() => navigate(`/seguimiento/${publication._id}`)}
                            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Ver Seguimiento
                        </button>
                    )}
                    {(!publication.ubicacionCarga || !publication.ubicacionDescarga) && (
                        <div className="flex items-center justify-between">
                            <p className="text-red-500">Publicación Incompleta</p>
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Completar Publicación
                            </button>
                        </div>
                    )}
                </div>
            </a>
        ))}
    </div>
);
}

export default UserPublicationsPage;
