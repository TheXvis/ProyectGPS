import { useState } from 'react';

const CarrierRegister = () => {
    const [showFirstForm, setShowFirstForm] = useState(true);
    //valores para validar contraseña
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);

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

    const handleFirstSubmit = (event) => {
        event.preventDefault();
        setShowFirstForm(true);
    };

    const handleSecondForm = (event) => {
        event.preventDefault();
        setShowFirstForm(false);
    };

    const formatRut = (rut) => {
        if (!rut) return '';
        let rutBody = rut.slice(0, -1);
        let rutDv = rut.slice(-1);
        rutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${rutBody}-${rutDv}`;
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        if (id === 'rut') {
            const formattedRut = formatRut(value.replace(/\./g, '').replace('-', ''));
            setCarrierData({
                ...carrierData,
                [id]: formattedRut
            });
        } else {
            setCarrierData({
                ...carrierData,
                [id]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        checkPasswordMatch(carrierData.password, value);
    };

    const checkPasswordMatch = (password, confirmPassword) => {
        setPasswordMatch(password === confirmPassword);
    };

    const handleSecondSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMatch) {
            alert("Las contraseñas no coinciden");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/carrier/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...carrierData,
                    rut: carrierData.rut.replace(/\./g, '').replace('-', '')
                })
            });
            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.error(err.message);
        }
    };
    return (

        <div>
            {showFirstForm ? (
                <form onSubmit={handleSecondForm}>
                    <div className="max-w-sm mx-auto">
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres</label>
                                <input type="text" id="nombre"
                                    name='nombre'
                                    onChange={handleChange}
                                    value={carrierData.nombre}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                            </div>
                            <div>
                                <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellidos</label>
                                <input type="text" id="apellido"
                                    name='apellido'
                                    onChange={handleChange}
                                    value={carrierData.apellido}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
                            </div>
                            <div>
                                <label htmlFor="rut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rut</label>
                                <input type="text" id="rut"
                                    name='rut'
                                    onChange={handleChange}
                                    value={carrierData.rut}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="xx.xxx.xxx-x" required />
                            </div>
                            <div>
                                <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefono</label>
                                <input type="tel" id="telefono"
                                    name='telefono'
                                    onChange={handleChange}
                                    value={carrierData.telefono}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+56912345678" pattern="\+?[0-9\s]{1,15}" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electronico</label>
                            <input type="email" id="email"
                                name='email'
                                onChange={handleChange}
                                value={carrierData.email}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                            <input type="password" id="password"
                                name='password'
                                onChange={handleChange}
                                value={carrierData.password}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar contraseña</label>
                            <input type="password" id="confirm_password"
                                onChange={handleConfirmPasswordChange}
                                value={confirmPassword}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${passwordMatch ? 'border-gray-300' : 'border-red-500'}`} placeholder="•••••••••" required />
                                {!passwordMatch && <p className="text-red-500 text-sm">Las contraseñas no coinciden</p>}
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continuar</button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSecondSubmit}>
                    <div className="max-w-sm mx-auto" >
                        <div className="mb-5">
                            <label htmlFor="vehiculo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vehículo</label>
                            <input type="text" id="vehiculo"
                                name='vehiculo'
                                onChange={handleChange}
                                value={carrierData.vehiculo}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese el vehículo" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="patente" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patente</label>
                            <input type="text" id="patente"
                                name='patente'
                                onChange={handleChange}
                                value={carrierData.patente}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la patente"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="ubicacion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicación</label>
                            <input type="text" id="ubicacion"
                                name='ubicacion'
                                onChange={handleChange}
                                value={carrierData.ubicacion}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la ubicación" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                            <input type="text" id="descripcion"
                                name='descripcion'
                                onChange={handleChange}
                                value={carrierData.descripcion}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la descripción" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="capacidadCarga" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Capacidad de Carga</label>
                            <input type="number" id="capacidadCarga"
                                name='capacidadCarga'
                                onChange={handleChange}
                                value={carrierData.capacidadCarga}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Ingrese la capacidad de carga" />
                        </div>
                        <div className="flex">
                            <div className="pr-2">
                                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Registrar</button>
                            </div>
                            <div className="pl-2">
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={handleFirstSubmit}
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

        </div >

    );
}

export default CarrierRegister
