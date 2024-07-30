/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import LeafletRoutingMachine from "../../mapServices/LeafletRoutingMachine";
import io from "socket.io-client";
import L from "leaflet";
import TruckIcon from "../../assets/truck.svg";

const currentLocationIcon = new L.Icon({
	iconUrl: TruckIcon,
	iconSize: [38, 38],
	iconAnchor: [19, 19],
	popupAnchor: [0, -19],
});

const MapUpdater = ({ currentPosition, heading, zoomLevel }) => {
	const map = useMap();

	useEffect(() => {
		if (currentPosition) {
			map.setView(currentPosition, zoomLevel, {
				animate: true,
				duration: 1,
			});
			map.getPane("mapPane").style.transform = `rotate(${heading}deg)`;
		}
	}, [map, currentPosition, heading, zoomLevel]);

	return null;
};

function NavigationPage() {
	const { id } = useParams();
	const [publication, setPublication] = useState(null);
	const [currentPosition, setCurrentPosition] = useState(null);
	const [heading, setHeading] = useState(0);
	const socketRef = useRef(null);
	const [previousDistance, setPreviousDistance] = useState(null);

	useEffect(() => {
		const fetchPublication = async () => {
			const response = await fetch(
				`http://localhost:3000/publication/buscar/${id}`
			);
			const data = await response.json();
			setPublication(data);
		};
		socketRef.current = io("/");
		// join
		socketRef.current.emit("joinLocation", { id });
        

		fetchPublication();
	}, [id]);

	useEffect(() => {
		const updatePosition = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude, heading } = position.coords;
						const newPosition = [latitude, longitude];
						setCurrentPosition(newPosition);
						if (heading !== null) {
							setHeading(heading);
						}
						socketRef.current.emit("locationUpdate", {
							id,
							latitude,
							longitude,
							heading,
						});
					},
					(error) => {
						console.error("Error obteniendo la ubicación:", error);
					}
				);
			} else {
				console.error("Geolocalización no es soportada por este navegador.");
			}
		};

		const intervalId = setInterval(updatePosition, 10000);
		updatePosition();

		return () => {
			clearInterval(intervalId);
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, [id]);

	if (!publication) return <div>Loading...</div>;

	const { ubicacionCarga, ubicacionDescarga } = publication;
	const initialCargaPosition = JSON.parse(ubicacionCarga);
	const initialDescargaPosition = JSON.parse(ubicacionDescarga);

	const handleDistanceChange = (distance) => {
		if (distance !== previousDistance) {
			setPreviousDistance(distance);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
			<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
				Navegación GPS
			</h2>

			<MapContainer
				center={currentPosition}
				zoom={16}
				style={{ height: "60vh", width: "100%" }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={initialCargaPosition}>
					<Popup>Origen</Popup>
				</Marker>
				<Marker position={initialDescargaPosition}>
					<Popup>Destino</Popup>
				</Marker>
				{currentPosition && (
					<Marker position={currentPosition} icon={currentLocationIcon}>
						<Popup>Ubicación Actual</Popup>
					</Marker>
				)}
				<LeafletRoutingMachine
					origin={initialCargaPosition}
					destination={initialDescargaPosition}
					onDistanceChange={handleDistanceChange}
				/>
				<MapUpdater
					currentPosition={currentPosition}
					heading={heading}
					zoomLevel={16}
				/>
			</MapContainer>
		</div>
	);
}

export default NavigationPage;
