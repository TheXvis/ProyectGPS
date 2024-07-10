import { useState, useEffect } from 'react';

export const useCarrierService = () => {
    const [carriers, setCarriers] = useState([]);

    useEffect(() => {
        fetchCarriers();
    }, []); // Se ejecuta solo una vez al montar el componente

    const fetchCarriers = async () => {
        try {
            const response = await fetch("http://localhost:3000/carrier/verTodos", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            setCarriers(result);
        } catch (err) {
            console.error(err.message);
        }
    };

    const editCarrier = async (rut, carrierData) => {
        try {
            const response = await fetch(`http://localhost:3000/carrier/editar/${rut}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(carrierData)
            });
            if (response.ok) {
                fetchCarriers(); // Actualizar la lista de carriers después de editar
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const deleteCarrier = async (rut) => {
        try {
            const response = await fetch(`http://localhost:3000/carrier/borrar/${rut}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                fetchCarriers(); // Actualizar la lista después de eliminar
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const getCarrierById = async (rut) => {
        try {
            const response = await fetch(`http://localhost:3000/carrier/ver/${rut}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            return result; // Retorna el carrier buscado
        } catch (err) {
            console.error(err.message);
            return null;
        }
    };

    return { carriers, editCarrier, deleteCarrier, getCarrierById };
};