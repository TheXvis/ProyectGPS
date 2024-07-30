import React, { useState } from 'react';
import Modal from 'react-modal';

const CouponList = ({ coupons, handleFileChange, handleUploadFile, handleDeleteCoupon, handleDeleteReceipt, setSelectedCoupon, setShowEditModal, isAdminView }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedImage('');
    };

    return (
        <div>
            <ul style={{ padding: '0', listStyleType: 'none' }}>
                {coupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
                    const dueDate = new Date(coupon.dueDate);
                    return (
                        <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón {coupon.publicationName || 'Sin nombre'} - Destino: {coupon.publicationDestination || 'Sin destino'}</div>
                            <div>Rut: {coupon.userId}</div>
                            <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                            <div>Monto: {coupon.amount}</div>
                            <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                            {coupon.receipt && (
                                <div>
                                    <p>Imagen subida:</p>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${coupon.receipt}`}
                                        alt="Receipt"
                                        style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }}
                                        onClick={() => openModal(`${import.meta.env.VITE_API_URL}/${coupon.receipt}`)}
                                    />
                                </div>
                            )}
                            {!isAdminView && !coupon.receipt && (
                                <>
                                    <input type="file" accept=".png, .jpg" onChange={(e) => handleFileChange(e, coupon._id)} className="mt-2" />
                                    <button
                                        className="mt-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => handleUploadFile(coupon._id)}
                                    >
                                        Subir comprobante
                                    </button>
                                </>
                            )}
                            {!isAdminView && coupon.receipt && (
                                <button
                                    className="mt-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => handleDeleteReceipt(coupon._id)}
                                >
                                    Cambiar comprobante
                                </button>
                            )}
                            {!isAdminView && (
                                <button
                                    className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-1"
                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                >
                                    Eliminar
                                </button>
                            )}
                            {isAdminView && (
                                <>
                                    <button
                                        className="mt-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                        onClick={() => {
                                            setSelectedCoupon(coupon);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        Editar estado
                                    </button>
                                    <button
                                        className="mt-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-1"
                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                    >
                                        Eliminar
                                    </button>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Imagen del comprobante"
                style={{
                    content: {
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        margin: 'auto',
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '10px',
                        overflow: 'auto'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                }}
            >
                <div>
                    <button onClick={closeModal} style={{ display: 'block', margin: '0 auto 10px' }}>Cerrar</button>
                    <img src={selectedImage} alt="Comprobante ampliado" style={{ width: '80%', maxWidth: '400px', height: 'auto', margin: 'auto' }} />
                </div>
            </Modal>
        </div>
    );
};

export default CouponList;
