import React, { useState, useEffect } from "react";
import InputField from "./InputField";

function FormComponent() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [location, setLocation] = useState(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation([position.coords.latitude, position.coords.longitude]);
			},
			(error) => {
				console.error("Error obtaining location:", error);
			}
		);
	}, []);

	return (
		<form className="space-y-4" style={{ height: "19vh", width: "100%" }}>
			<InputField
				id="origin"
				placeholder="Origen"
				value={origin}
				setValue={setOrigin}
			/>
			<InputField
				id="destination"
				placeholder="Destino"
				value={destination}
				setValue={setDestination}
			/>
		</form>
	);
}

export default FormComponent;
