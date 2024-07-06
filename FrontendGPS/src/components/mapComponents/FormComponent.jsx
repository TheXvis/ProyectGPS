import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";

function FormComponent({ setOriginMarkerPosition, setDestinationMarkerPosition }) {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");

	return (
		<form className="space-y-4" style={{ height: "19vh", width: "100%" }}>
			<InputField
				id="origin"
				placeholder="Origen"
				value={origin}
				setValue={setOrigin}
				setMarkerPosition={setOriginMarkerPosition}
			/>
			<InputField
				id="destination"
				placeholder="Destino"
				value={destination}
				setValue={setDestination}
				setMarkerPosition={setDestinationMarkerPosition}
			/>
		</form>
	);
}

export default FormComponent;
