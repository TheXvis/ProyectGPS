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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/review/crear`, {
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

  return (
    <>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => setIsModalOpen(true)}
      >
        Dejar Reseña
      </button>
      {isModalOpen && (
        <div className="modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
          <div className="modal-content w-70 p-10 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                <select
                  id="rating"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Seleccione un rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-5">
                <label htmlFor="comentario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comentario</label>
                <textarea
                  id="comentario"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Enviar Reseña
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReseñaForm;