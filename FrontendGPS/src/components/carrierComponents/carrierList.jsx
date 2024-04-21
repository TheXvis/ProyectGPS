import { useEffect, useState } from "react"
const CarrierList = () => {

    const [carriers, setCarriers] = useState([]);

    useEffect(() => {
        const fetchCarriers = async () => {
            try {
                const response = await fetch("http://localhost:3000/carrier/verTodos",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });
                const result = await response.json();
                setCarriers(result);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchCarriers()
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-100 shadow-md rounded-xl">
                    <thead>
                        <tr className="bg-blue-gray-100 text-gray-700">
                            <th className="py-3 px-4 text-left">RUT</th>
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">apellido</th>
                            <th className="py-3 px-4 text-left">telefono</th>
                            <th className="py-3 px-4 text-left">vehiculo</th>
                            <th className="py-3 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-blue-gray-900">
                        {carriers.map((carrier) => (
                            <tr className="border-b border-blue-gray-200" key={carrier._id}>
                                <td className="py-3 px-4">{carrier.rut}</td>
                                <td className="py-3 px-4">{carrier.nombre}</td>
                                <td className="py-3 px-4">{carrier.apellido}</td>
                                <td className="py-3 px-4">{carrier.telefono}</td>
                                <td className="py-3 px-4">{carrier.vehiculo}</td>
                                <td className="py-3 px-4">
                                    <a className="font-medium text-blue-600 hover:text-blue-800">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CarrierList