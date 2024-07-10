import  { useEffect, useState } from 'react';

function UserPublicationsPage() {
    const [publications, setPublications] = useState([]);
  
    useEffect(() => {
      const fetchPublications = async () => {
        const rutUser = localStorage.getItem('rut');
        const response = await fetch(`http://localhost:3000/publication/ver/${rutUser}`);
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
              </div>
            </a>
          ))}
        </div>
      );
  }
  
  export default UserPublicationsPage;