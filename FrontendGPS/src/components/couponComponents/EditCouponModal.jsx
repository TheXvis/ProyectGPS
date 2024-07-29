import React from 'react';

const EditCouponModal = ({ selectedCoupon, handleUpdateCouponStatus, setShowEditModal }) => {
    return (
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
    );
};

export default EditCouponModal;
