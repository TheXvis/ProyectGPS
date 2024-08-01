import { useState, useEffect } from 'react';

export const usePublicationService = () => {
    const [publications, setPublications] = useState([]);

    useEffect(() => {
        fetchPublications();
    }, []); // Se ejecuta solo una vez al montar el componente

    const fetchPublications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/verTodo`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            setPublications(result);
        } catch (err) {
            console.error(err.message);
        }
    };

    const editPublication = async (id, publicationData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/editar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(publicationData)
            });
            if (response.ok) {
                fetchPublications(); // Actualizar la lista de publicaciones después de editar
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const deletePublication = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/borrar/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                fetchPublications(); // Actualizar la lista después de eliminar
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const getPublicationById = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/ver/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            return result; // Retorna la publicación buscada
        } catch (err) {
            console.error(err.message);
            return null;
        }
    };

    return { publications, editPublication, deletePublication, getPublicationById, fetchPublications, setPublications };
};