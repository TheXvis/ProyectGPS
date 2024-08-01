import { useState } from 'react';
import { usePublicationService } from "../../hooks/usePublicationService";
import ChatComponent from '../chatComponents/chatComponent';

const PublicationListCard = () => {
    const { publications } = usePublicationService();
    const rawRut = localStorage.getItem('rut');
    const rut = rawRut ? rawRut.replace(/\./g, '').replace('-', '') : '';
    const role = localStorage.getItem('role');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPublication, setSelectedPublication] = useState(null);

    const openModal = (publication) => {
        setSelectedPublication(publication);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPublication(null);
    };
    
    const filteredPublications = publications.filter(publication => {
        if (role === 'carrier') {
            return publication.estado === "En transito" && publication.rutCarrier === rut;
        } else if (role === 'user') {
            return publication.estado === "En transito" && publication.rutUser === rut;
        }
        return false;
    });

    return (
        <>
            {filteredPublications.map((publication) => (
                <div key={publication._id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{publication.tipoMercancia}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Precio: {publication.precio}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Peso: {publication.peso}</p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Estado: {publication.estado}</p>
                    <button 
                        onClick={() => openModal(publication)} 
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Open Modal
                    </button>
                </div>
            ))}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-t-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{selectedPublication.tipoMercancia}</h2>
                        <ChatComponent />
                        <button 
                            onClick={closeModal} 
                            className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default PublicationListCard;