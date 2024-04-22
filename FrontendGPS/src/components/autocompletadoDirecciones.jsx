import React, { useState, useEffect, useRef } from "react";

function Direccion() {
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

	const originTimer = useRef(null); // Crea una referencia para el temporizador
	const destinationTimer = useRef(null); // Crea una referencia para el temporizador

	function fetchSuggestions(query, setSuggestions) {
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
	}

	function handleOriginInputChange(event) {
		var query = event.target.value;
		// busca numero de casa en el string query
		var houseNumberMatch = query.match(/\d+/);
		setHouseNumber(houseNumberMatch ? houseNumberMatch[0] : ""); // Actualiza el estado de houseNumber
		setOrigin(query);
		clearTimeout(originTimer.current); // Limpia el temporizador actual
		originTimer.current = setTimeout(() => {
			//cambiar espacios en blanco por %20
			query = query.replace(/\s/g, "%20");
			fetchSuggestions(query, setOriginSuggestions);
		}, 1500); // Inicia un nuevo temporizador que espera 1.5 segundos antes de invocar fetchSuggestions
	}

	function handleDestinationInputChange(event) {
		var query = event.target.value;
		// busca numero de casa en el string query
		var houseNumberMatch = query.match(/\d+/);
		setHouseNumber(houseNumberMatch ? houseNumberMatch[0] : ""); // Actualiza el estado de houseNumber
		setDestination(query);
		clearTimeout(destinationTimer.current); // Limpia el temporizador actual
		destinationTimer.current = setTimeout(() => {
			//cambiar espacios en blanco por %20
			query = query.replace(/\s/g, "%20");
			fetchSuggestions(query, setDestinationSuggestions);
		}, 1500); // Espera 1.5 segundos antes de invocar fetchSuggestions
	}

	function handleSuggestionClick(setInput, suggestion) {
		console.log(suggestion.display_name);
		setInput(`${houseNumber} ${suggestion.display_name}`);
		
	}
	

	function handleBlur() {
		setTimeout(() => {
			setOriginSuggestions([]); // Limpia las sugerencias de origen después de 200 ms cuando el campo de origen pierde el foco
		}, 200);
	}


	return (
		<form className="space-y-4">
			<div>
				<label htmlFor="origin" className="block font-medium text-gray-700">
					Origin:
				</label>
				<input
					type="text"
					id="origin"
					name="origin"
					value={origin}
					className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					onChange={handleOriginInputChange}
					onBlur={handleBlur}
				/>
				<ul className="suggestions">
					{originSuggestions.slice(0, 5).map((suggestion, index) => (
						<li
							key={index}
							className="suggestion gb-white-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
							onClick={() => handleSuggestionClick(setOrigin, suggestion)}>
							{`${houseNumber} ${suggestion.display_name}`}
						</li>
					))}
				</ul>
			</div>
			<div>
				<label
					htmlFor="destination"
					className="block font-medium text-gray-700">
					Destination:
				</label>
				<input
					type="text"
					id="destination"
					name="destination"
					value={destination}
					className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					onChange={handleDestinationInputChange}
					onBlur={handleBlur}
				/>
				<ul className="suggestions">
					{destinationSuggestions.slice(0, 5).map((suggestion, index) => (
						<li
							key={index}
							className="suggestion gb-white-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
							onClick={() => handleSuggestionClick(setDestination, suggestion)}>
							{`${houseNumber} ${suggestion.display_name}`}
						</li>
					))}
				</ul>
			</div>
		</form>
	);
}

export default Direccion;
