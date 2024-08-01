import  { useEffect, useState } from 'react';

function PublicationList() {
    const [publications, setPublications] = useState([]);
    const [filterCity, setFilterCity] = useState('');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchPublications = async () => {
                const url = `${import.meta.env.VITE_API_URL}/publication/filtrar/${encodeURIComponent(filterCity)}`;
                const response = await fetch(url);
                const data = await response.json();
                setPublications(data);          
        };

        fetchPublications();
    }, [filterCity]);

    useEffect(() => {
        const fetchCities = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/ciudadesinicio`); // Paso 3
            const data = await response.json();
            setCities(data); 
        };
        
        fetchCities();
    }, []); 

    return (
        <div className="p-4 ml-64">
            <div className="max-w-sm ">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona una opcion:</label>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
            >
                <option value="">Seleccione una ciudad</option>
                {cities.map((city) => ( 
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
            </div>   


            {publications.map((publication) => (
                <a key={publication._id} href={`/publication/details/${publication._id}`} className="mt-20 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-2">
                    <img className="object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" style={{ width: '50%', height: '200px', objectFit: 'cover' }} src={`${import.meta.env.VITE_API_URL}/${publication.imagen}`} alt={publication.title} />
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{publication.nombre}</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.ubicacionCarga}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.ubicacionDescarga}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.estado}</p>
                    </div>
                </a>
                
            ))}
            
        </div>
    );
}

export default PublicationList;