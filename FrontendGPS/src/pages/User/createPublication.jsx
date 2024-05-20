import { useState } from 'react';
import axios from 'axios';

function CreatePublicationForm() {
  const [rutUser] = useState(localStorage.getItem('rut') || '');
  const [nombre, setNombre] = useState('');
  const [tipoMercancia, setTipoMercancia] = useState('');
  const [imagen, setImagen] = useState('');
  const [peso, setPeso] = useState('');
  const [precio, setPrecio] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
      formData.append('rutUser', rutUser);
      formData.append('nombre', nombre);
      formData.append('tipoMercancia', tipoMercancia);
      formData.append('imagen', imagen);
      formData.append('peso', peso);
      formData.append('precio', precio);
      formData.append('ubicacion', ubicacion);

      try {
        const response = await axios.post('http://localhost:3000/publication/crear', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        alert('Publicación creada exitosamente');
      } catch (error) {
        console.error(error);
        alert('Error');
      }
    };

  return (
    <div  className="max-w-lg mx-auto block mb-2 p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>

    <div className="mb-5">
        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
        <input type="text" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />
    </div>

    <div className="mb-5">
        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de mercancia</label>
        <input type="text" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={tipoMercancia} onChange={(e) => setTipoMercancia(e.target.value)} placeholder="Tipo Mercancia" required />
    </div>

    <div className="mb-5">
      <label htmlFor="image-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imagen</label>
      <input type="file" id="image-input" className="dark:text-white" onChange={(e) => setImagen(e.target.files[0])} required />
    </div>

    <div className="mb-5">
        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Peso</label>
        <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Peso" required />
    </div>

    <div className="mb-5">
        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
        <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" required />
    </div>

    <div className="mb-5">
        <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicacion</label>
        <input type="text" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ubicacion" required />
    </div>
    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Registrar publicacion</button>
    </form>
    </div>
  );
}

export default CreatePublicationForm;