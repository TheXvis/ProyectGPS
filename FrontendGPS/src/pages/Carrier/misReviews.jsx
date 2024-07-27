import { useEffect, useState } from 'react';

const MisReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rutCarrier = localStorage.getItem('rut');

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const response = await fetch(`http://localhost:3000/publication/verPCa/${rutCarrier}`);
        if (!response.ok) {
          throw new Error('Error al obtener las reseñas');
        }
        const data = await response.json();
        setPublicaciones(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [rutCarrier]);


  useEffect(() => {
    const misReviews = async () => {
        const response = await fetch(`http://localhost:3000/review/ver/${rutCarrier}`);
        const data = await response.json();
        setReviews(data);
    };
    misReviews();
  }, [rutCarrier]);

  useEffect(() => {
    if (reviews.length > 0 && publicaciones.length > 0) {
      const combined = reviews.map(review => {
        const pub = publicaciones.find(publicacion => publicacion._id === review.idPublicacion);
        return { ...review, ...pub };
      });
      setCombinedData(combined);
    }
  }, [reviews, publicaciones]);


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center p-4">
      {combinedData.length === 0 ? (
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">No hay reseñas disponibles.</p>
      ) : (
        <div className="space-y-4 w-full">
          {combinedData.map((combinedData) => (
            <div key={combinedData._id} className="flex items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 p-4 w-full md:w-3/4 lg:w-1/2 mx-auto">
              <img className="h-auto w-48 mr-4" src={`http://localhost:3000/${combinedData.imagen}`} alt="image description" />
              <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Publicacion: {combinedData.nombre}</h1>
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-8 h-8 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Rating: {combinedData.rating}</p>
                </div>
                <p className="font-normal text-gray-700 dark:text-gray-400">Comentario: {combinedData.comentario}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisReviews;
