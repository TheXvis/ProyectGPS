/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import EditPublicationForm from "../../components/userComponents/editPublicationForm";
import ReseñaForm from "../../components/userComponents/reseñaForm";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LeafletRoutingMachine from "../../mapServices/LeafletRoutingMachine";

const sendEmail = (templateId, variables) => {
	emailjs
		.send(
			import.meta.env.VITE_EMAILJS_SERVICE_ID,
			templateId,
			variables,
			import.meta.env.VITE_EMAILJS_PUBLIC_KEY
		)
		.then((response) => {
			console.log(
				"Correo enviado exitosamente:",
				response.status,
				response.text
			);
		})
		.catch((err) => {
			console.error("Error al enviar el correo:", err);
		});
};

const MapView = ({ startLat, startLng, endLat, endLng }) => (
	<div>
		<MapContainer
			center={[startLat, startLng]}
			zoom={13}
			style={{ height: "200px", width: "100%" }}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<Marker position={[startLat, startLng]}>
				<Popup>Inicio</Popup>
			</Marker>
			<Marker position={[endLat, endLng]}>
				<Popup>Fin</Popup>
			</Marker>
			<LeafletRoutingMachine
				origin={[startLat, startLng]}
				destination={[endLat, endLng]}
			/>
		</MapContainer>
	</div>
);

function PublicationDetailsPage() {
	const { id } = useParams();
	const [publication, setPublication] = useState(null);
	const [reviews, setReviews] = useState(null);
	const userRole = localStorage.getItem("role");
	const navigate = useNavigate();
	const [ubicacionCargaLat, setUbicacionCargaLat] = useState(null);
	const [ubicacionCargaLng, setUbicacionCargaLng] = useState(null);
	const [ubicacionDescargaLat, setUbicacionDescargaLat] = useState(null);
	const [ubicacionDescargaLng, setUbicacionDescargaLng] = useState(null);

	useEffect(() => {
		const fetchPublication = async () => {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/publication/buscar/${id}`
			);
			const data = await response.json();
			data.ubicacionCarga = JSON.parse(data.ubicacionCarga);
			data.ubicacionDescarga = JSON.parse(data.ubicacionDescarga);

			setUbicacionCargaLat(data.ubicacionCarga.lat);
			setUbicacionCargaLng(data.ubicacionCarga.lng);
			setUbicacionDescargaLat(data.ubicacionDescarga.lat);
			setUbicacionDescargaLng(data.ubicacionDescarga.lng);
			setPublication(data);
		};

		fetchPublication();
	}, [
		id,
		ubicacionCargaLat,
		ubicacionCargaLng,
		ubicacionDescargaLat,
		ubicacionDescargaLng,
	]);

	useEffect(() => {
		const misReviews = async () => {
			if (publication && publication.rutCarrier) {
				const carrierRut = publication.rutCarrier;
				// console.log(carrierRut);
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/review/ver/${carrierRut}`
				);
				const data = await response.json();
				setReviews(data);
				// console.log(data);
			}
		};

		misReviews();
	}, [publication]);

	// Función que calcula el promedio de ratings
	const getAverageRating = () => {
		if (!reviews || reviews.length === 0) return 0;
		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
		return (totalRating / reviews.length).toFixed(2);
	};

	// Funciones del carrier
	const solucitarPublicacion = async () => {
		const carrierRut = localStorage.getItem("rut").replace(/[.-]/g, "");
		// const userEmail = (
		// 	publication?.userEmail || "correoDesconocido@example.com"
		// ).trim();

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/carrier/aceptar/${id}/${carrierRut}`,
			{
				method: "PUT",
			}
		);

		if (response.ok) {
			const carrierNombre = localStorage.getItem("nombre");
			const carrierApellido = localStorage.getItem("apellido");
			const userEmail = publication.userEmail;

			// console.log("Enviando correo a:", userEmail);
			// console.log("Nombre del Carrier:", carrierNombre);
			// console.log("Apellido del Carrier:", carrierApellido);

			sendEmail(import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
				user_email: userEmail,
				carrier_nombre: carrierNombre,
				carrier_apellido: carrierApellido,
				publication_nombre: publication.nombre,
			});

			alert("Publicación solicitada con éxito");
		} else {
			alert("Error al solicitar la publicación");
		}
	};

	const iniciarViaje = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/publication/inicioviaje/${id}`,
			{
				method: "PUT",
			}
		);

		if (response.ok) {
			alert("Viaje comenzado con exito");
			// console.log(id);
			navigate(`/navegacion/${id}`);
		} else {
			alert("Error al comenzar el viaje");
		}
	};

	const finalizarViaje = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/publication/finviaje/${id}`,
			{
				method: "PUT",
			}
		);

		if (response.ok) {
			alert("Viaje finalizado con éxito");
		} else {
			alert("Error al finalizar el viaje");
		}
	};

	// Funciones del user
	const deletePublication = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/publication/borrar/${id}`,
			{
				method: "DELETE",
			}
		);

		if (response.ok) {
			navigate("/usuario-home");
		} else {
			alert("Error al eliminar la publicación");
		}
	};

	const cancelarPublicacion = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/publication/cancelar/${id}`,
			{
				method: "PUT",
			}
		);
		if (response.ok) {
			alert("Publicación cancelada con éxito");
		} else {
			alert("Error al cancelar la publicación");
		}
	};

	const aceptarPublicacion = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/publication/aceptar/${id}`,
			{
				method: "PUT",
			}
		);
		if (response.ok) {
			alert("Publicación aceptada con éxito");
		} else {
			alert("Error al aceptar la publicación");
		}
	};

	// const handlePay = () => {
	// 	navigate(`/pago`);
	// 	// window.location.href = 'http://localhost:5173/pago';
	// };

	if (!publication) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
			<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sm:p-10 inline-block text-center">
				<h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
					{publication.nombre}
				</h5>
				<img
					src={`${import.meta.env.VITE_API_URL}/${publication.imagen}`}
					alt={publication.nombre}
					className="mx-auto w-1/4 mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400"
				/>
				{/* aqui mapa */}
				<div className="mt-5 relative z-0">
					<MapView
						startLat={ubicacionCargaLat}
						startLng={ubicacionCargaLng}
						endLat={ubicacionDescargaLat}
						endLng={ubicacionDescargaLng}
					/>
				</div>
				<p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
					Precio: {"$" + publication.precio}
				</p>
				<p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
					Tipo de mercancia: {publication.tipoMercancia}
				</p>
				<p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
					Peso: {publication.peso}
				</p>
				<p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
					Estado: {publication.estado}
				</p>

				{userRole === "carrier" &&
					publication.estado.trim() === "Disponible" && (
						<button
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={solucitarPublicacion}>
							Solicitar Publicación
						</button>
					)}
				{userRole === "carrier" && publication.estado.trim() === "Aceptado" && (
					<button
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						onClick={iniciarViaje}>
						Iniciar viaje
					</button>
				)}
				{userRole === "carrier" &&
					publication.estado.trim() === "En transito" && (
						<button
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={finalizarViaje}>
							Finalizar viaje
						</button>
					)}
				{userRole === "user" && (
					<>
						<button
							onClick={deletePublication}
							className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
							Eliminar publicación
						</button>
						<div>
							<EditPublicationForm />
						</div>
					</>
				)}
				{userRole === "user" && publication.estado.trim() === "Finalizado" && (
					<div>
						<ReseñaForm />
					</div>
				)}
			</div>
			{userRole === "user" &&
				publication &&
				publication.estado &&
				publication.estado.trim() == "Pendiente" && (
					<div className="justify-center  bg-white dark:bg-gray-800 p-2 shadow inline-block text-center mt-4 ml-21 items-center">
						<div>
							<p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
								RUT del Carrier: {publication.rutCarrier}
							</p>
							<p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
								Nombre: {publication.nombreCarrier}
							</p>
							<div className="flex items-center">
								{[...Array(Math.floor(getAverageRating()))].map((_, index) => (
									<svg
										key={index}
										className="w-4 h-4 text-yellow-300 me-1"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 22 20">
										<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
									</svg>
								))}
								{[...Array(5 - Math.floor(getAverageRating()))].map(
									(_, index) => (
										<svg
											key={index}
											className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 22 20">
											<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
										</svg>
									)
								)}
								<p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
									{getAverageRating()}
								</p>
								<p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
									out of
								</p>
								<p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
									5
								</p>
							</div>

							<button
								onClick={aceptarPublicacion}
								className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
								Aceptar
							</button>
							<button
								onClick={cancelarPublicacion}
								className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
								Cancelar
							</button>
						</div>
					</div>
				)}
		</div>
	);
}

export default PublicationDetailsPage;
