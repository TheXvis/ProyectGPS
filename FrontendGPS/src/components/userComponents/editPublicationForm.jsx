import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


function EditPublicationForm() {
    const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [tipoMercancia, setTipoMercancia] = useState('');
  const [peso, setPeso] = useState('');
  const [precio, setPrecio] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar los datos de la publicación al montar el componente
  useEffect(() => {
    const fetchPublication = async () => {
      const response = await fetch(`http://localhost:3000/publication/buscar/${id}`);
      const data = await response.json();
      // Inicializa el estado del formulario con los datos cargados
      if (data) {
        setNombre(data.nombre || '');
        setTipoMercancia(data.tipoMercancia || '');
        setPeso(data.peso || '');
        setPrecio(data.precio || '');
        setUbicacion(data.ubicacion || '');
      }
    };
    fetchPublication();
  }, [id]);

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const publicationToUpdate = {
        nombre,
        tipoMercancia,
        peso,
        precio,
        ubicacion,
      };
      const response = await fetch(`http://localhost:3000/publication/editar/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publicationToUpdate),
      });
      if (response.ok) {
        console.log("Publicación actualizada con éxito");
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error de red al actualizar la publicación", error);
    }
  };

  return (
    <>
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setIsModalOpen(true)}>Editar Publicación</button>
      {isModalOpen && (
        <div className="modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
    <div className="modal-content w-70 p-10 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <span onClick={() => setIsModalOpen(false)} style={{ float: 'right', cursor: 'pointer' }}>&times;</span>
            
            <div  className="max-w-lg mx-auto block mb-2 p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"></div>
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
              <div className="mb-5">
              <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
              <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>

              <div className="mb-5">
              <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo mercancia</label>
              <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={tipoMercancia} onChange={(e) => setTipoMercancia(e.target.value)} />
              </div>

              <div className="mb-5">
              <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Peso</label>
              <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={peso} onChange={(e) => setPeso(e.target.value)} />
              </div>
              
              <div className="mb-5">
              <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
              <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} />
              </div>

              <div className="mb-5">
              <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicacion</label>
              <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
              </div>

              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit">Guardar cambios</button>
            </form>
          </div>
        </div>
        
      )}
    </>
  );
}

export default EditPublicationForm;