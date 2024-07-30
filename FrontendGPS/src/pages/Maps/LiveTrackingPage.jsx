import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";

function LiveTrackingPage() {
	const [publication, setPublication] = useState(null);
	const socketRef = useRef(null);
	const { id } = useParams();
	const [currentPosition, setCurrentPosition] = useState({
		lat: null,
		lng: null,
	});

	const fetchPublication = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/publication/buscar/${id}`
		);
		const data = await response.json();
		setPublication(data);
	};

	useEffect(() => {
		// Inicializa la conexión con Socket.IO
		socketRef.current = io("/");

		// Se une a la sala de ubicación correspondiente
		socketRef.current.on("connect", () => {
			console.log("Conectado al servidor de Socket.IO");
			socketRef.current.emit("joinLocation", { id });
		});

		// Escucha las actualizaciones de ubicación desde el servidor
		socketRef.current.on(
			"locationUpdate",
			({ id, latitude, longitude, heading }) => {
				console.log("Actualización de ubicación recibida:", {
					id,
					latitude,
					longitude,
					heading,
				});
				setCurrentPosition({ lat: latitude, lng: longitude });
			}
		);

		// Maneja errores de conexión
		socketRef.current.on("connect_error", (err) => {
			console.error("Error de conexión:", err);
		});

		// Limpia la conexión al desmontar el componente
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, [id]);

	const MapUpdater = ({ position }) => {
		const map = useMap();
		useEffect(() => {
			if (position.lat && position.lng) {
				map.setView([position.lat, position.lng], map.getZoom());
			}
		}, [position, map]);
		return null;
	};

	return (
		<div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
			<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
				Seguimiento en Vivo
			</h2>
			<MapContainer
				center={[currentPosition.lat || 0, currentPosition.lng || 0]}
				zoom={16}
				style={{ height: "60vh", width: "100%" }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{currentPosition.lat && currentPosition.lng && (
					<Marker position={[currentPosition.lat, currentPosition.lng]}>
						<Popup>Ubicación Actual</Popup>
					</Marker>
				)}
				<MapUpdater position={currentPosition} />
			</MapContainer>
		</div>
	);
}

export default LiveTrackingPage;
