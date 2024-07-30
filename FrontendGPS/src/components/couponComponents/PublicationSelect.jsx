import React from 'react';

const PublicationSelect = ({ publications, selectedPublication, setSelectedPublication }) => (
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
);

export default PublicationSelect;

