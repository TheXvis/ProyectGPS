import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import React, { useState, useEffect } from "react";
import LeafletRoutingMachine from "../../mapServices/LeafletRoutingMachine";

function MapComponent({ originPosition, destinationPosition }) {
	const [position, setPosition] = useState([
		-35.47773385588775, -71.9743932546383,
	]); // Default position if geolocation fails
	const [zoom, setZoom] = useState(6); // Default zoom level if no positions are set

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setPosition([position.coords.latitude, position.coords.longitude]);
				setZoom(13); // Set a higher zoom level if GPS position is available
				console.log(
					"GPS position:",
					position.coords.latitude,
					position.coords.longitude
				);
			},
			() => {
				console.error("Error obtaining location");
			}
		);
	}, []);

	return (
		<div style={{ height: "75vh", width: "99%" }}>
			<MapContainer
				center={position}
				zoom={zoom}
				scrollWheelZoom={true}
				style={{ height: "100%", width: "100%" }}>
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
					/>
				)}
			</MapContainer>
		</div>
	);
}

export default MapComponent;
