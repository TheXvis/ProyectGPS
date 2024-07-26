import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function PagoPage() {
    const [coupon, setCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [userId, setUserId] = useState(null);
    const [showCoupons, setShowCoupons] = useState(false);
    const [searchRut, setSearchRut] = useState('');
    const [adminCoupons, setAdminCoupons] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [publications, setPublications] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState(null);

    // Función para limpiar el RUT
    const cleanRut = (rut) => {
        return rut.replace(/[.\-]/g, '');
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            let rut = localStorage.getItem('rut');
            const role = localStorage.getItem('role');
            rut = cleanRut(rut);
            console.log('Valor de rut en localStorage:', rut);
            console.log('Rol del usuario:', role);
            setUserId(rut);
            setUserRole(role);
        }
    }, []);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/publication/ver/${userId}`);
                setPublications(response.data);
            } catch (error) {
                console.error(`Error al obtener las publicaciones: ${error}`);
            }
        };

        if (userId) {
            fetchPublications();
        }
    }, [userId]);

    const handleGenerateCoupon = async () => {
        if (!selectedPublication) {
            alert('Por favor, selecciona una publicación.');
            return;
        }

        const { precio, _id } = selectedPublication;
        const amount = precio;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
        const dueDateString = dueDate.toISOString();

        const data = {
            userId,
            amount,
            dueDate: dueDateString,
            publicationId: _id,
        };

        try {
            const response = await axios.post('http://localhost:3000/cupon', data);
            setCoupon(response.data);
            const doc = new jsPDF();

            // Titulo
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('Cupón de Pago', 105, 30, null, null, 'center');

            // Linea para separar
            doc.setLineWidth(1);
            doc.line(20, 35, 190, 35);

            // Detalles del cupón
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.text(`Cupón generado para el usuario: ${data.userId}`, 20, 50);
            doc.text(`Monto: ${data.amount}`, 20, 60);
            const formattedDueDate = new Date(data.dueDate).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            doc.text(`Fecha de vencimiento: ${formattedDueDate}`, 20, 70);

            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('Datos para pagar', 105, 90, null, null, 'center');

            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.text(`Cuenta a transferir: ${response.data.accountToTransfer}`, 20, 110);
            doc.text(`Nombre de la cuenta: ${response.data.accountName}`, 20, 120);

            doc.setLineWidth(0.5);
            doc.line(20, 125, 190, 125);

            // Pie de página
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Este es un cupón de pago generado automáticamente.', 105, 130, null, null, 'center');

            doc.save(`Cupon_${data.userId}.pdf`);
        } catch (error) {
            console.error(`Error al generar el cupón: ${error}`);
        }
    };

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/cupon`, {
                    params: { userId }
                });
                setCoupons(response.data);
            } catch (error) {
                console.error(`Error al obtener los cupones: ${error}`);
            }
        };

        if (userId) {
            fetchCoupons();
        }
    }, [userId]);

    const handleShowCoupons = () => {
        setShowCoupons(!showCoupons);
    };

    const handleDeleteCoupon = async (couponId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/cupon/${couponId}`);
            if (response.status === 200) {
                // Recarga los cupones después de eliminar uno
                setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
            } else {
                console.error('Error al eliminar el cupón');
            }
        } catch (error) {
            console.error('Error al eliminar el cupón', error);
        }
    };

    const handleSearchByRut = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/cupon`, {
                params: { userId: cleanRut(searchRut) }
            });
            if (response.data.length === 0) {
                setErrorMessage('Usuario no presenta cupones');
                setAdminCoupons([]);
            } else {
                setErrorMessage('');
                setAdminCoupons(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('Rut ingresado no está registrado');
            } else {
                setErrorMessage('Error al buscar cupones por RUT');
            }
            setAdminCoupons([]);
        }
    };

    const handleEditCoupon = (coupon) => {
        setSelectedCoupon(coupon);
        setShowEditModal(true);
    };

    const handleUpdateCouponStatus = async () => {
        const newStatus = !selectedCoupon.isPaid;
        try {
            const response = await axios.put(`http://localhost:3000/cupon/${selectedCoupon._id}`, {
                isPaid: newStatus
            });
            if (response.status === 200) {
                setCoupons(coupons.map(c => c._id === selectedCoupon._id ? { ...c, isPaid: newStatus } : c));
                setAdminCoupons(adminCoupons.map(c => c._id === selectedCoupon._id ? { ...c, isPaid: newStatus } : c));
                setShowEditModal(false);
                setSelectedCoupon(null);
            }
        } catch (error) {
            console.error('Error al actualizar el estado del cupón', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setSelectedFile(file);
        } else {
            alert('Por favor, sube un archivo .png o .jpg');
        }
    };

    const handleUploadFile = async (couponId) => {
        if (!selectedFile) {
            alert('No hay archivo seleccionado');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(`http://localhost:3000/cupon/upload/${couponId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setCoupons(coupons.map(c => c._id === couponId ? { ...c, receipt: response.data.receipt } : c));
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    };

    return (
        <div style={{ padding: '20px', marginLeft: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto 20px' }}>
                <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={handleGenerateCoupon}
                    style={{ marginRight: '10px' }}
                >
                    Generar cupón
                </button>
                <button
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={handleShowCoupons}
                >
                    Ver cupones
                </button>
            </div>
            {coupon && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ marginBottom: '10px' }}>Cupón generado</h2>
                    <p><strong>Id:</strong> {coupon._id}</p>
                    <p><strong>Rut:</strong> {coupon.userId}</p>
                    <p><strong>Monto:</strong> {coupon.amount}</p>
                    <p><strong>Fecha de Vencimiento</strong>: {new Date(coupon.dueDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</p>
                </div>
            )}
            {publications.length > 0 && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>

                    <select
                        value={selectedPublication ? selectedPublication._id : ''}
                        onChange={(e) => {
                            const selected = publications.find(p => p._id === e.target.value);
                            setSelectedPublication(selected);
                        }}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
                    >
                        <option value="" disabled>Seleccionar una publicación</option>
                        {publications.map((publication) => (
                            <option key={publication._id} value={publication._id}>{publication.nombre} - {publication.precio}</option>
                        ))}
                    </select>
                </div>
            )}
            {showCoupons && (
                <div>
                    <ul style={{ padding: '0', listStyleType: 'none' }}>
                        {coupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
                            const dueDate = new Date(coupon.dueDate);
                            return (
                                <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón {index + 1}: {coupon._id}</div>
                                    <div>Rut: {coupon.userId}</div>
                                    <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                                    <div>Monto: {coupon.amount}</div>
                                    <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                                    {userId === coupon.userId && (
                                        <>
                                            <input type="file" accept=".png, .jpg" onChange={handleFileChange} className="mt-2" />
                                            <button
                                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                                onClick={() => handleUploadFile(coupon._id)}
                                            >
                                                Subir comprobante
                                            </button>
                                            {coupon.receipt && (
                                                <div>
                                                    <p>Imagen subida:</p>
                                                    <img src={`http://localhost:3000/${coupon.receipt}`} alt="Receipt" style={{ maxWidth: '100%' }} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {userId === 'admin' && coupon.receipt && (
                                        <div>
                                            <p>Imagen subida:</p>
                                            <img src={`http://localhost:3000/${coupon.receipt}`} alt="Receipt" style={{ maxWidth: '100%' }} />
                                        </div>
                                    )}
                                    {userId === 'admin' && (
                                        <button
                                            type="button"
                                            onClick={() => handleEditCoupon(coupon)}
                                            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                        >
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                                                <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
                                            </svg>
                                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Editar</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Eliminar</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            {userRole === 'admin' && (
                <div style={{ marginTop: '20px', color: 'white' }}>
                    <h3 style={{ marginBottom: '10px' }}>Buscar cupones por RUT</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={searchRut}
                            onChange={(e) => setSearchRut(e.target.value)}
                            placeholder="Ingrese RUT"
                            style={{ padding: '10px', borderRadius: '5px', marginRight: '10px', flex: '1', color: 'black' }}
                        />
                        <button
                            className="text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            onClick={handleSearchByRut}
                        >
                            Buscar
                        </button>
                    </div>
                    {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
                    {adminCoupons.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Resultados de la búsqueda</h4>
                            <ul style={{ padding: '0', listStyleType: 'none' }}>
                                {adminCoupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
                                    const dueDate = new Date(coupon.dueDate);
                                    return (
                                        <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón {index + 1}: {coupon._id}</div>
                                            <div>Rut: {coupon.userId}</div>
                                            <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                                            <div>Monto: {coupon.amount}</div>
                                            <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                                            {coupon.receipt && (
                                                <div>
                                                    <p>Imagen subida:</p>
                                                    <img src={`http://localhost:3000/${coupon.receipt}`} alt="Receipt" style={{ maxWidth: '100%' }} />
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleEditCoupon(coupon)}
                                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            >
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
                                                </svg>
                                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Editar</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Editar estado del cupón</h2>
                        <p>Id: {selectedCoupon._id}</p>
                        <p>Rut: {selectedCoupon.userId}</p>
                        <p>Monto: {selectedCoupon.amount}</p>
                        <p>Fecha de Vencimiento: {new Date(selectedCoupon.dueDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}</p>
                        <p>Estado: {selectedCoupon.isPaid ? 'Pagado' : 'No pagado'}</p>
                        <button
                            className="mt-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={handleUpdateCouponStatus}
                        >
                            {selectedCoupon.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
                        </button>
                        <button
                            className="mt-4 ml-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PagoPage;
