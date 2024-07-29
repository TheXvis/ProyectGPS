import { useState } from 'react';

const CouponList = ({ coupons, handleFileChange, handleUploadFile, handleDeleteCoupon, userId }) => {
    const [editCouponId, setEditCouponId] = useState(null); // Estado para el cupón que está en modo edición

    const handleEditClick = (couponId) => {
        setEditCouponId(couponId); // Establecer el cupón que está siendo editado
    };

    const handleFileChangeWrapper = (event, couponId) => {
        handleFileChange(event); // Llamar a la función original
        setEditCouponId(null); // Salir del modo edición una vez que se selecciona un archivo
        handleUploadFile(couponId); // Subir el archivo inmediatamente después de seleccionarlo
    };

    return (
        <div>
            <ul style={{ padding: '0', listStyleType: 'none' }}>
                {coupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
                    const dueDate = new Date(coupon.dueDate);
                    return (
                        <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón ({coupon.publicationName || 'Sin nombre'} - Destino: {coupon.publicationDestination || 'Sin destino'})</div>
                            <div>Rut: {coupon.userId}</div>
                            <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                            <div>Monto: {coupon.amount}</div>
                            <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                            {userId === coupon.userId && (
                                <>
                                    {!coupon.receipt && (
                                        <>
                                            <input type="file" accept=".png, .jpg" onChange={(e) => handleFileChangeWrapper(e, coupon._id)} className="mt-2" />
                                            <button
                                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                                onClick={() => handleUploadFile(coupon._id)}
                                            >
                                                Subir comprobante
                                            </button>
                                        </>
                                    )}
                                    {coupon.receipt && (
                                        <div>
                                            <p>Imagen subida:</p>
                                            <img src={`http://localhost:3000/${coupon.receipt}`} alt="Receipt" style={{ maxWidth: '350px', maxHeight: '350px' }} />
                                            {editCouponId === coupon._id ? (
                                                <input type="file" accept=".png, .jpg" onChange={(e) => handleFileChangeWrapper(e, coupon._id)} className="mt-2" />
                                            ) : (
                                                <button
                                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                                    onClick={() => handleEditClick(coupon._id)}
                                                >
                                                    Editar
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
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
    );
};

export default CouponList;
