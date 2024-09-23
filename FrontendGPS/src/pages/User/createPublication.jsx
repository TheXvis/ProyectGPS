import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePublicationForm() {
	const [rutUser] = useState(localStorage.getItem("rut") || "");
	const [nombre, setNombre] = useState("");
	const [tipoMercancia, setTipoMercancia] = useState("");
	const [imagen, setImagen] = useState("");
	const [peso, setPeso] = useState("");
	const [mostrarOtroInput, setMostrarOtroInput] = useState(false);
    const [otroTipo, setOtroTipo] = useState('');
	const navigate = useNavigate();

	const handleTipoMercanciaChange = (e) => {
        const value = e.target.value;
        setTipoMercancia(value);
        setMostrarOtroInput(value === 'Otros');
    };

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("rutUser", rutUser);
		formData.append("nombre", nombre);
		formData.append("tipoMercancia", tipoMercancia);
		formData.append("imagen", imagen);
		formData.append("peso", peso);

		try {
			const response = await axios.post(
				"http://localhost:3000/publication/crear",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log(response.data);
			console.log(response.data._id);
			// alert("Publicación creada exitosamente");
			navigate("/ver-mapa", { state: { publicationId: response.data._id } });
		} catch (error) {
			console.error(error);
			alert("Error");
		}
	};

	return (
		<div className="max-w-lg mx-auto block mb-2 p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
				<div className="mb-5">
					<label
						htmlFor="large-input"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Nombre
					</label>
					<input
						type="text"
						id="base-input"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						placeholder="Nombre"
						required
					/>
				</div>
				<div className="mb-5">
					<label
						htmlFor="large-input"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Tipo de mercancia
					</label>
                    <select
                        id="tipo-mercancia"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={tipoMercancia}
                        onChange={handleTipoMercanciaChange}
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Electrodomesticos">Electrodomesticos</option>
                        <option value="Ropa">Ropa</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Muebles">Muebles</option>
                        <option value="Herramientas">Herramientas</option>
						<option value="Electronica">Electronica</option>
                        <option value="Maquinaria">Maquinaria</option>
						<option value="Deportes">Deportes</option>
                        <option value="Otros">Otros</option>
                    </select>
				</div>
				{mostrarOtroInput && (
                    <div className="mb-5">
                        <label
                            htmlFor="otro-tipo"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Especificar otro tipo
                        </label>
                        <input
                            type="text"
                            id="otro-tipo"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={otroTipo}
                            onChange={(e) => setOtroTipo(e.target.value)}
                            placeholder="Especificar otro tipo"
                            required={mostrarOtroInput}
                        />
                    </div>
                )}
				<div className="mb-5">
					<label
						htmlFor="image-input"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Imagen
					</label>
					<input
						type="file"
						id="image-input"
						className="dark:text-white"
						onChange={(e) => setImagen(e.target.files[0])}
						required
					/>
				</div>
				<div className="mb-5">
					<label
						htmlFor="large-input"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Peso
					</label>
					<input
						type="number"
						id="base-input"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={peso}
						onChange={(e) => setPeso(e.target.value)}
						placeholder="Peso"
						required
					/>
				</div>
				<button
					type="submit"
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					Siguiente
				</button>
			</form>
		</div>
	);
}

export default CreatePublicationForm;
