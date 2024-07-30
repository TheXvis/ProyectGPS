/* eslint-disable react/prop-types */
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import LeafletRoutingMachine from "../../mapServices/LeafletRoutingMachine";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { calculatePrice } from "../../mapServices/priceCalculator";
import { useNavigate } from "react-router-dom";

function MapComponent({ originPosition, destinationPosition }) {
	const location = useLocation();
	const { publicationId } = location.state;
	const [position, setPosition] = useState([
		-35.47773385588775, -71.9743932546383,
	]); // Default position if geolocation fails
	const [zoom, setZoom] = useState(6); // Default zoom level if no positions are set
	const [price, setPrice] = useState(100); // Example fixed price
	const [showModal, setShowModal] = useState(false); // State to control modal visibility
	const [showModalVerification, setShowModalVerification] = useState(false); // modal para confirmr que se public correctamente
	const [distance, setDistance] = useState(0); // Distance of the trip
	const mapRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setPosition([position.coords.latitude, position.coords.longitude]);
				setZoom(13); // Set a higher zoom level if GPS position is available
			},
			() => {
				console.error("Error obtaining location");
			}
		);
	}, []);

	const handleDistanceChange = (newDistance) => {
		setDistance(newDistance);
	};

	const handlePublish = async () => {
		const calculatedPrice = await calculatePrice(distance); // Calculate the price before showing the modal
		setPrice(calculatedPrice);
		setShowModal(true); // Mostrar el modal de confirmación
	};

	const confirmPublish = async () => {
		try {
			// Formatear las ubicaciones como strings
			const formattedOrigin = JSON.stringify(originPosition);
			const formattedDestination = JSON.stringify(destinationPosition);

			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/publication/${publicationId}`,
				{
					ubicacionCarga: formattedOrigin,
					ubicacionDescarga: formattedDestination,
					precio: price,
				}
			);

			// Redireccionar a mis publicaciones
			setShowModal(false); // Cerrar el modal después de publicar
			// si se publica correctamente, mostrar el modal de verificacion
			if (response.status === 200) {
				setShowModalVerification(true); // Abre el modal de confirmacio
			}
		} catch (error) {
			console.error("Error updating publication:", error);
			alert("Hubo un error al publicar el viaje");
			setShowModal(false); // Cerrar el modal en caso de error
		}
	};

	return (
		<div className="flex flex-col items-center w-full h-full relative">
			<MapContainer
				center={position} 	
				zoom={zoom}
				scrollWheelZoom={true}
				style={{ height: "100vh", width: "100%", zIndex: 1 }}
				whenCreated={(map) => (mapRef.current = map)} // Ensure mapRef is set correctly
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{originPosition && (
					<Marker position={originPosition}>
						<Popup>Origen</Popup>
					</Marker>
				)}
				{destinationPosition && (
					<Marker position={destinationPosition}>
						<Popup>Destino</Popup>
					</Marker>
				)}
				{originPosition && destinationPosition && (
					<LeafletRoutingMachine
						origin={originPosition}
						destination={destinationPosition}
						onDistanceChange={handleDistanceChange} // Pass the distance change handler
					/>
				)}
			</MapContainer>
			<div style={{ marginTop: "10px", textAlign: "center", zIndex: 10 }}>
				{originPosition && destinationPosition && (
					<button
						onClick={handlePublish}
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
						Publicar Viaje
					</button>
				)}
			</div>

			{/* Modal para confirmar publicación */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
					<div className="bg-white p-6 rounded-lg shadow-lg z-10">
						<h2 className="text-lg font-bold mb-4">Confirmación</h2>
						<p className="mb-4">
							¿Estás seguro de que deseas publicar este viaje?
						</p>
						<p className="mb-4">El precio será $ {price}</p>
						<div className="flex justify-end">
							<button
								onClick={confirmPublish}
								className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700">
								Sí, publicar
							</button>
							<button
								onClick={() => setShowModal(false)}
								className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Modal de verificación */}
			{showModalVerification && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
					<div className="bg-white p-6 rounded-lg shadow-lg z-10">
						<h2 className="text-lg font-bold mb-4">
							La publicación fue publicada exitosamente
						</h2>
						<p className="mb-4"></p>
						<div className="flex justify-end">
							<button
								// redirigir a navigate('/usuario-home'); y cerrar el modal
								onClick={() => {
									setShowModalVerification(false);
									navigate("/usuario-home");
								}}
								className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700">
								Continuar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default MapComponent;
