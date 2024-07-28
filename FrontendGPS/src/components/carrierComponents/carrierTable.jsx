import { useState } from 'react'
import { useCarrierService } from '../../hooks/useCarrierService';
import Alert from '../Alerts';

const CarrierTable = () => {
    const { carriers, fetchCarrier, editCarrier, deleteCarrier, setCarriers } = useCarrierService();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [carriers, setCarriers] = useState([]);

    //hacer inputs editables
    const [isEditable, setIsEditable] = useState(false);
    //paginar carriers
    const [currentPage, setCurrentPage] = useState(1);
    const carriersPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');
    // Filtrar carriers basado en searchTerm
    const filteredCarriers = carriers.filter(carrier => carrier.rut.includes(searchTerm));

    const indexOfLastCarrier = currentPage * carriersPerPage;
    const indexOfFirstCarrier = indexOfLastCarrier - carriersPerPage;
    const currentCarriers = filteredCarriers.slice(indexOfFirstCarrier, indexOfLastCarrier);

    const [selectedCarrier, setSelectedCarrier] = useState({});

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [carrierToDelete, setCarrierToDelete] = useState(null);

    // Alerta
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });

    const handleCarrierClick = async (rut) => {
        const data = await fetchCarrier(rut);
        setSelectedCarrier(data || {});
        setIsModalOpen(true);
        setIsEditable(false);
    };

    //logica para hacer inputs editables

    const handleEditClick = (event) => {
        event.preventDefault(); // Previene el comportamiento predeterminado del formulario
        setIsEditable(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCarrier(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveClick = async (event) => {
        event.preventDefault();
        if (selectedCarrier) {
            await editCarrier(selectedCarrier.rut, selectedCarrier);
            setIsEditable(false);
            setIsModalOpen(false);
            setAlert({ message: 'Carrier updated successfully!', type: 'success', visible: true });
        }
    };

    const handleDeleteClick = (rut) => {
        setCarrierToDelete(rut);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        if (carrierToDelete) {
            try {
                await deleteCarrier(carrierToDelete);
                setAlert({ message: 'Carrier deleted successfully!', type: 'success', visible: true });
                const updatedCarriers = carriers.filter(carrier => carrier.rut !== carrierToDelete);
                setCarriers(updatedCarriers);
            } catch (error) {
                setAlert({ message: `Failed to delete carrier: ${error.message}`, type: 'error', visible: true });
            } finally {
                setShowDeleteConfirmation(false);
                setCarrierToDelete(null);
            }
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, visible: false });
    };



    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {alert.visible && <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />}

            {showDeleteConfirmation && (
                <div id="alert-additional-content-2" className="fixed inset-0 flex items-center justify-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                    <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800 max-w-md mx-auto">
                        <div className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-medium">ATENCION</h3>
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                            ¿Estás seguro de que deseas eliminar este carrier? Esta acción no se puede deshacer.
                        </div>
                        <div className="flex">
                            <button type="button" className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={confirmDelete}>
                                Confirmar
                            </button>
                            <button type="button" className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800" onClick={() => setShowDeleteConfirmation(false)} aria-label="Close">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
                <div>
                    {/* Botón y dropdown aquí */}
                </div>
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        {/* Ícono de búsqueda aquí */}
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Buscar RUT"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
                <div>

                    {/* <!-- Dropdown menu --> */}
                    <div id="dropdownAction" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reward</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Promote</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
                            </li>
                        </ul>
                        <div className="py-1">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete User</a>
                        </div>
                    </div>
                </div>
                <label htmlFor="table-search" className="sr-only">Search</label>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Carrier
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Vehiculo
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Patente
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Acciones
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Eliminar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            <img className="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image" />
                            <div className="ps-3">
                                <div className="text-base font-semibold">Neil Sims</div>
                                <div className="font-normal text-gray-500">neil.sims@flowbite.com</div>
                            </div>
                        </th>
                        <td className="px-6 py-4">
                            React Developer
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Online
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            {/* <!-- Modal toggle --> */}
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => setIsModalOpen(true)}
                            >
                                boton
                            </button>
                        </td>
                    </tr>

                    {currentCarriers.map((carrier) => (
                        <tr key={carrier._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="ps-3">
                                    <div className="text-base font-semibold">{carrier.nombre} {carrier.apellido}</div>
                                    <div className="font-normal text-gray-500">{carrier.rut}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">
                                {carrier.vehiculo}
                            </td>
                            <td className="px-6 py-4">
                                {carrier.patente}
                            </td>
                            <td className="px-6 py-4">
                                {/* <!-- Modal toggle --> */}
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => handleCarrierClick(carrier.rut)}
                                >
                                    Ver Detalles
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                {/* <!-- Modal toggle --> */}
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => handleDeleteClick(carrier.rut)}
                                >
                                    ELIMINAR
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <div>
                <button
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(carriers.length / carriersPerPage)}
                >
                    Next
                </button>
            </div>

            {isModalOpen && selectedCarrier && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 p-4 md:p-8">
                    <div className="relative w-full max-w-2xl max-h-full">
                        <form className="relative bg-white rounded-lg shadow dark:bg-gray-700" onSubmit={handleSaveClick} >
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Editar Carrier
                                </h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="editUserModal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Cerrar modal</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="rut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">RUT</label>
                                        <input type="text" name="rut" id="rut" value={selectedCarrier.rut} readOnly className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                                        <input type="text" name="nombre" id="nombre" value={selectedCarrier.nombre} readOnly className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
                                        <input type="text" name="apellido" id="apellido" value={selectedCarrier.apellido} readOnly className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teléfono</label>
                                        <input type="text" name="telefono" id="telefono" value={selectedCarrier.telefono} onChange={handleInputChange} readOnly={!isEditable} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                                        <input type="text" name="descripcion" id="descripcion" value={selectedCarrier.descripcion} onChange={handleInputChange} readOnly={!isEditable} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="vehiculo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vehículo</label>
                                        <input type="text" name="vehiculo" id="vehiculo" value={selectedCarrier.vehiculo} onChange={handleInputChange} readOnly={!isEditable} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="patente" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patente</label>
                                        <input type="text" name="patente" id="patente" value={selectedCarrier.patente} onChange={handleInputChange} readOnly={!isEditable} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="ubicacion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicación</label>
                                        <input type="text" name="ubicacion" id="ubicacion" value={selectedCarrier.ubicacion} onChange={handleInputChange} readOnly={!isEditable} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="capacidadCarga" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Capacidad de Carga</label>
                                        <select
                                            id="capacidadCarga"
                                            name="capacidadCarga"
                                            onChange={handleInputChange}
                                            value={selectedCarrier.capacidadCarga}
                                            disabled={!isEditable}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option value={0}>Seleccione la capacidad de carga</option>
                                            <option value={5}>Carga ligera: máx 5 kg</option>
                                            <option value={25}>Carga media: 5 kg - 25 kg</option>
                                            <option value={1000}>Carga pesada: 25 kg - 1 tonelada</option>
                                            <option value={1001}>Carga muy pesada: más de 1 tonelada</option>
                                        </select>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rol</label>
                                        <input type="text" name="role" id="role" value={selectedCarrier.role} readOnly className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="email" id="email" value={selectedCarrier.email} readOnly className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cerrar</button>
                                <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={(event) => handleEditClick(event)} // Pasa el evento al controlador
                                >
                                    Modificar
                                </button>
                                {isEditable && (
                                    <button
                                        type="submit"
                                        className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    // onClick={handleSaveClick}
                                    >
                                        Guardar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default CarrierTable