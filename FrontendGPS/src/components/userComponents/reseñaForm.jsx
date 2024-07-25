import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReseñaForm = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [comentario, setComentario] = useState('');
  const [idPublicacion, setIdPublicacion] = useState('');
  const rutUser = localStorage.getItem('rut');

  useEffect(() => {
    setIdPublicacion(id);
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reviewData = {
        rutUser,
        idPublicacion,
        rating,
        comentario
      };

      const response = await fetch(`http://localhost:3000/review/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        console.log("Reseña publicada con éxito");
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al crear", error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-6 h-6 ${i <= rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
          onClick={() => setRating(i)}
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
        </svg>
      );
    }
    return stars;
  };

  return (
    <>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => setIsModalOpen(true)}
      >
        Dejar Reseña
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                <div className="flex items-center">
                  {renderStars()}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comentario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comentario</label>
                <textarea
                  id="comentario"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Enviar Reseña
              </button>
              <button
                type="button"
                className="mt-4 w-full text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReseñaForm;
