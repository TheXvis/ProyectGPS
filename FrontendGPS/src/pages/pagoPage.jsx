import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';
import CouponList from '../components/couponComponents/couponList';
import CouponForm from '../components/couponComponents/couponForm';
import PublicationSelect from '../components/couponComponents/PublicationSelect';
import EditCouponModal from '../components/couponComponents/EditCouponModal';

function PagoPage() {
    const [coupon, setCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [userId, setUserId] = useState(null);
    const [showCoupons, setShowCoupons] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [publications, setPublications] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchRut, setSearchRut] = useState('');
    const [adminCoupons, setAdminCoupons] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);


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

    const cleanRut = (rut) => {
        return rut.replace(/[.\-]/g, '');
    };

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/publication/ver/${userId}`);
                setPublications(response.data);
            } catch (error) {
                console.error(`Error al obtener las publicaciones: ${error}`);
            }
        };

        if (userId) {
            fetchPublications();
        }
    }, [userId]);

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat,
                    lon: lng,
                    format: 'json'
                }
            });
            return response.data.display_name;
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
            return 'Sin destino';
        }
    };

    const sendEmailToAdmin = async (subject, message) => {
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    subject,
                    message,
                    to_email: import.meta.env.VITE_ADMIN_EMAIL,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            console.log('Correo enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }
    };


    const handleGenerateCoupon = async () => {
        if (!selectedPublication) {
            alert('Por favor, selecciona una publicación.');
            return;
        }

        const { precio, _id, nombre, ubicacionDescarga } = selectedPublication;
        const amount = precio;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
        const dueDateString = dueDate.toISOString();

        let interpUbicacionDescarga;
        try {
            interpUbicacionDescarga = JSON.parse(ubicacionDescarga);
        } catch (e) {
            console.error("Error al interpretar la ubicación de descarga:", e);
            alert("Ubicación de descarga no válida");
            return;
        }

        if (interpUbicacionDescarga && interpUbicacionDescarga.lat && interpUbicacionDescarga.lng) {
            console.log("Ubicación de descarga válida:", interpUbicacionDescarga);
        } else {
            console.error("Ubicación de descarga no válida:", interpUbicacionDescarga);
            alert("Ubicación de descarga no válida");
            return;
        }

        const address = await fetchAddress(interpUbicacionDescarga.lat, interpUbicacionDescarga.lng);
        console.log("Dirección obtenida:", address);

        const data = {
            userId,
            amount,
            dueDate: dueDateString,
            publicationId: _id,
            publicationName: nombre,
            publicationDestination: address
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/cupon`, data);
            const newCoupon = {
                ...response.data,
                publicationName: nombre,
                publicationDestination: address
            };
            console.log("Nuevo cupón generado:", newCoupon);
            setCoupon(newCoupon);
            setCoupons([...coupons, newCoupon]);  // Actualiza el estado de la lista de cupones

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

            // Enviar correo al admin
            await sendEmailToAdmin(
                'Nuevo Cupón Generado',
                `El usuario ${userId} ha generado un nuevo cupón con ID ${newCoupon._id}.`
            );
        } catch (error) {
            console.error(`Error al generar el cupón: ${error}`);
        }
    };


    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/cupon`, {
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
        if (window.confirm("¿Está seguro que desea eliminar este cupón?")) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/cupon/${couponId}`);
                if (response.status === 200) {
                    // Actualiza los cupones para eliminar el cupón eliminado
                    setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
                    setAdminCoupons(adminCoupons.filter((coupon) => coupon._id !== couponId));
                } else {
                    console.error('Error al eliminar el cupón');
                }
            } catch (error) {
                console.error('Error al eliminar el cupón', error);
            }
        }
    };

    const handleFileChange = (event, couponId) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setSelectedFile({ file, couponId });
        } else {
            alert('Por favor, sube un archivo .png o .jpg');
        }
    };

    const handleUploadFile = async (couponId) => {
        if (!selectedFile || selectedFile.couponId !== couponId) {
            alert('No hay archivo seleccionado o el archivo seleccionado no coincide con el cupón.');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile.file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/cupon/upload/${couponId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                setCoupons(coupons.map(c => c._id === couponId ? { ...c, receipt: response.data.receipt } : c));
                setSelectedFile(null);


                await sendEmailToAdmin(
                    'Comprobante Subido',
                    `El usuario ${userId} ha subido un comprobante para el cupón con ID ${couponId}.`
                );
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    };

    const handleDeleteReceipt = async (couponId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/cupon/${couponId}/delete-image/`);
            if (response.status === 200) {
                setCoupons(coupons.map(c => c._id === couponId ? { ...c, receipt: null } : c));
            }
        } catch (error) {
            console.error('Error al eliminar el comprobante:', error);
        }
    };

    const handleSearchByRut = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/cupon`, {
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

    const handleUpdateCouponStatus = async () => {
        const newStatus = !selectedCoupon.isPaid;
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/cupon/${selectedCoupon._id}`, {
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
                    <p><strong>Rut:</strong> {coupon.userId}</p>
                    <p><strong>Monto:</strong> {coupon.amount}</p>
                    <p><strong>Fecha de Vencimiento</strong>: {new Date(coupon.dueDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</p>
                    <p><strong>Publicación:</strong> {coupon.publicationName}</p>
                    <p><strong>Destino:</strong> {coupon.publicationDestination}</p>
                </div>
            )}
            <PublicationSelect
                publications={publications}
                selectedPublication={selectedPublication}
                setSelectedPublication={setSelectedPublication}
            />
            {showCoupons && (
                <CouponList
                    coupons={coupons}
                    handleFileChange={handleFileChange}
                    handleUploadFile={handleUploadFile}
                    handleDeleteCoupon={handleDeleteCoupon}
                    handleDeleteReceipt={handleDeleteReceipt}
                    setSelectedCoupon={setSelectedCoupon}
                    setShowEditModal={setShowEditModal}
                    isAdminView={false}
                />
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
                            <CouponList
                                coupons={adminCoupons}
                                handleFileChange={handleFileChange}
                                handleUploadFile={handleUploadFile}
                                handleDeleteCoupon={handleDeleteCoupon}
                                setSelectedCoupon={setSelectedCoupon}
                                setShowEditModal={setShowEditModal}
                                isAdminView={true}
                            />
                        </div>
                    )}
                </div>
            )}
            {showEditModal && (
                <EditCouponModal
                    selectedCoupon={selectedCoupon}
                    handleUpdateCouponStatus={handleUpdateCouponStatus}
                    setShowEditModal={setShowEditModal}
                />
            )}
        </div>
    );
}

export default PagoPage;
