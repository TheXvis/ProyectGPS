import  { useEffect, useState } from 'react';

const MisReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rutCarrier = localStorage.getItem('rut');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/review/ver/${rutCarrier}`);
        if (!response.ok) {
          throw new Error('Error al obtener las reseñas');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [rutCarrier]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 ml-64">
      {reviews.length === 0 ? (
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">No hay reseñas disponibles.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-2">
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Rating: {review.rating}</h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Comentario: {review.comentario}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MisReviews;