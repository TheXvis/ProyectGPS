import React from "react";
import Button from "./Button";
import L from "leaflet";
import "leaflet-control-geocoder";

function InputField({ id, placeholder, value, setValue, setMarkerPosition }) {
	const handleInputChange = (event) => {
		setValue(event.target.value);
	};

	const handleSendAddress = () => {
		console.log("Sending address:", value);
		const geocoder = L.Control.Geocoder.nominatim();
		geocoder.geocode(value, (results) => {
			if (results && results.length > 0) {
				const { center } = results[0];
				console.log("Geocode result:", center);
				setMarkerPosition(center);
			} else {
				alert("Address not found");
			}
		});
	};

	const handleMapButton = () => {
		alert("Ubicar en el mapa functionality is not yet implemented");
	};

	const handleGpsButton = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setMarkerPosition([latitude, longitude]);
			},
			(error) => {
				alert("Error obtaining GPS location");
			}
		);
	};

	return (
		<div className="flex items-center relative">
			<input
				type="text"
				id={id}
				name={id}
				placeholder={placeholder}
				value={value}
				className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 mb-1 mr-2"
				onChange={handleInputChange}
			/>
			<Button
				iconSrc="send"
				title="Enviar dirección"
				onClick={handleSendAddress}
			/>
			<Button
				iconSrc="map"
				title="Ubicar en el mapa"
				onClick={handleMapButton}
			/>
			<Button
				iconSrc="gps"
				title="Ubicar con GPS"
				onClick={handleGpsButton}
			/>
		</div>
	);
}

export default InputField;
