import React, { useState, useEffect, useRef } from "react";
import InputField from "./InputField";

function FormComponent() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [originSuggestions, setOriginSuggestions] = useState([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState([]);
	const [location, setLocation] = useState(null);
	const [houseNumber, setHouseNumber] = useState(null);

	const countryCode = "CL";

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

	const fetchSuggestions = (query, setSuggestions) => {
		if (!query) {
			setSuggestions([]);
			return;
		}

		let url = `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=${countryCode}&format=json&addressdetails=0&limit=5`;
		if (location) {
			const [lat, lon] = location;
			const viewbox = `${lon - 10},${lat + 25},${lon + 10},${lat - 25}`;
			url += `&viewbox=${viewbox}`;
		}
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setSuggestions(data);
			})
			.catch((error) => {
				console.error("Error fetching suggestions:", error);
			});
	};

	return (
		<form className="space-y-4" style={{ height: "19vh", width: "100%" }}>
			<InputField
				id="origin"
				placeholder="Origen"
				value={origin}
				setValue={setOrigin}
				suggestions={originSuggestions}
				setSuggestions={setOriginSuggestions}
				fetchSuggestions={fetchSuggestions}
				location={location}
				houseNumber={houseNumber}
				setHouseNumber={setHouseNumber}
			/>
			<InputField
				id="destination"
				placeholder="Destino"
				value={destination}
				setValue={setDestination}
				suggestions={destinationSuggestions}
				setSuggestions={setDestinationSuggestions}
				fetchSuggestions={fetchSuggestions}
				location={location}
				houseNumber={houseNumber}
				setHouseNumber={setHouseNumber}
			/>
		</form>
	);
}

export default FormComponent;
