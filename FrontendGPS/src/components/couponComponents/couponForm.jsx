import React from 'react';

function CouponForm({ handleGenerateCoupon, setSelectedPublication, publications, selectedPublication }) {
    return (
        <div style={{ width: '100%', marginRight: '10px' }}>
            <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleGenerateCoupon}
            >
                Generar cupón
            </button>
            <select
                value={selectedPublication ? selectedPublication._id : ''}
                onChange={(e) => {
                    const selected = publications.find(p => p._id === e.target.value);
                    setSelectedPublication(selected);
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '10px' }}
            >
                <option value="" disabled>Seleccionar una publicación</option>
                {publications.map((publication) => (
                    <option key={publication._id} value={publication._id}>{publication.nombre} - {publication.precio}</option>
                ))}
            </select>
        </div>
    );
}

export default CouponForm;
