import React from 'react'
import { useState } from 'react';

const CarrierRegister = () => {

    const [carrierData, setCarrierData] = useState({
        rut: "",
        password: "",
        nombre: "",
        apellido: "",
        telefono: "",
        descripcion: "",
        vehiculo: "",
        patente: "",
        ubicacion: "",
        disponibilidad: false,
        capacidadCarga: 0,
        calificacion: 0,
        role: "carrier",
        email: ""
    });

    const [showSecondForm, setShowSecondForm] = useState(false);

    const handleFirstSubmit = (e) => {
        e.preventDefault();
        setShowSecondForm(true);
    }

    const handleChange = (e) => {
        setCarrierData({
            ...carrierData,
            [e.target.id]: e.target.value
        });
    }

    const handleSecondSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/carrier/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(carrierData)
            });
            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.error(err.message);
        }
    }
    return (

        <div>
            {/* Primer formulario */}
            {!showSecondForm && (
                <form onSubmit={handleFirstSubmit}>
                    <div className="max-w-sm mx-auto">
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres</label>
                                <input type="text" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                            </div>
                            <div>
                                <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellidos</label>
                                <input type="text" id="apellido" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
                            </div>
                            <div>
                                <label htmlFor="rut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rut</label>
                                <input type="text" id="rut" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Flowbite" required />
                            </div>
                            <div>
                                <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefono</label>
                                <input type="tel" id="telefono" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electronico</label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar contraseña</label>
                            <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div>
                        <div className="flex items-start mb-6">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                            </div>
                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continuar</button>
                    </div>
                </form>
            )}
            {/* Segundo formulario, que se muestra después de enviar el primero */}
            {showSecondForm && (
                <form onSubmit={handleSecondSubmit}>
                    <div className="w-1/2 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 p-6 max-w-sm mx-auto" >
                        <div className="mb-5">
                            <label htmlFor="vehiculo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vehículo</label>
                            <input type="text" id="vehiculo" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese el vehículo" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="patente" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patente</label>
                            <input type="text" id="patente" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la patente" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="ubicacion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicación</label>
                            <input type="text" id="ubicacion" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la ubicación" required />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                            <input type="text" id="descripcion" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la descripción" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="capacidadCarga" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Capacidad de Carga</label>
                            <input type="number" id="capacidadCarga" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la capacidad de carga" />
                        </div>

                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Registrar</button>
                    </div>
                </form>
            )}
        </div >

    )
}

export default CarrierRegister