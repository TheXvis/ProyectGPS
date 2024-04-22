import React,{ useState } from "react";

const CarrierForm = () => {
const [newCarrier, setNewCarrier] = useState({
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

const handleInputChange = (e) => {
    setNewCarrier({
        ...newCarrier,
        [e.target.name]: e.target.value
    });
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3000/carrier/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCarrier)
        });
        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.error(err.message);
    }
}

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal ENFERMEDAAAA</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive ENFERMEDAAAA.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Nombres
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={newCarrier.nombre}
                                        id="first-name"
                                        onChange={handleInputChange}
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Apellidos
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={newCarrier.apellido}
                                        id="last-name"
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    RUT
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="rut"
                                        value={newCarrier.rut}
                                        id="last-name"
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    telefono
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={newCarrier.telefono}
                                        id="last-name"
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email 
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        value={newCarrier.email}
                                        type="email"
                                        onChange={handleInputChange}
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    rol
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="role"
                                        value={newCarrier.role}
                                        id="last-name"
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="password"
                                        value={newCarrier.password}
                                        id="last-name"
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Repetir Contraseña
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <h2 className="text-base font-semibold leading-7 text-gray-900 col-span-full">vehiculo ENFERMEDAAAA</h2>

                            <div className="sm:col-span-3">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                    Vehiculo
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="vehiculo"
                                        value={newCarrier.vehiculo}
                                        id="street-address"
                                        onChange={handleInputChange}
                                        autoComplete="street-address"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                    Patente
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="patente"
                                        value={newCarrier.patente}
                                        id="street-address"
                                        onChange={handleInputChange}
                                        autoComplete="street-address"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    Ubicacion
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="ubicacion"
                                        value={newCarrier.ubicacion}
                                        id="city"
                                        onChange={handleInputChange}
                                        autoComplete="address-level2"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                    capacidad de carga
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="capacidadCarga"
                                        value={newCarrier.capacidadCarga}
                                        id="region"
                                        onChange={handleInputChange}
                                        autoComplete="address-level1"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                    calificacion
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CarrierForm
