import { useState, useEffect } from 'react';

export const useUserService = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []); // Se ejecuta solo una vez al montar el componente

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/verTodos`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            setUsers(result);
        } catch (err) {
            console.error(err.message);
        }
    };

    const editUser = async (rut, userData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/editar/${rut}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                fetchUsers(); // Actualizar la lista de usuarios después de editar
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const deleteUser = async (rut) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/borrar/${rut}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                fetchUsers(); // Actualizar la lista después de eliminar
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const getUserById = async (rut) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/ver/${rut}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            return result; // Retorna el usuario buscado
        } catch (err) {
            console.error(err.message);
            return null;
        }
    };

    const fetchUser = async (rut) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/ver/${rut}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            return result; // Retorna el usuario buscado
        } catch (err) {
            console.error(err.message);
            return null;
        }
    };

    return { users, editUser, deleteUser, getUserById, fetchUser, setUsers };
};