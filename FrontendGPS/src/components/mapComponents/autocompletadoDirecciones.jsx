import React, { useState, useEffect, useRef } from "react";
import SendIcon from "./../../assets/send.svg";
import GpsIcon from "./../../assets/gps.svg";
import MapIcon from "./../../assets/mapPoint.svg";

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

	function handleInputChange(event, setInput, setSuggestions) {
		var query = event.target.value;
		// busca numero de casa en el string query
		var houseNumberMatch = query.match(/\d+/);
		setHouseNumber(houseNumberMatch ? houseNumberMatch[0] : ""); // Actualiza el estado de houseNumber
		setInput(query);
		clearTimeout(originTimer.current); // Limpia el temporizador actual
		originTimer.current = setTimeout(() => {
			//cambiar espacios en blanco por %20
			query = query.replace(/\s/g, "%20");
			fetchSuggestions(query, setSuggestions);
		}, 1500); // Espera 1.5 segundos antes de invocar fetchSuggestions
	}

	function handleOriginInputChange(event) {
		handleInputChange(event, setOrigin, setOriginSuggestions);
	}

	function handleDestinationInputChange(event) {
		handleInputChange(event, setDestination, setDestinationSuggestions);
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
		
		<form className="space-y-4" style={{ height: "19vh", width: "100%" }}>
			


			<div className="flex items-center">
				<label htmlFor="origin" className="block font-medium text-gray-700">
					Origen:
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
				<button
					type="button"
					className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2">
					<img src={SendIcon} className="w-6 h-6 invert group-hover:invert-0" />
					<span className="sr-only">Icono de Enviar</span>
				</button>
				<button
					type="button"
					className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2">
					<img src={MapIcon} className="w-6 h-6 invert group-hover:invert-0" />
					<span className="sr-only">Icono de ubicar en el mapa</span>
				</button>
				<button
					type="button"
					className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2">
					<img src={GpsIcon} className="w-6 h-6 invert group-hover:invert-0" />
					<span className="sr-only">Icono de ubicar con GPS</span>
				</button>
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
			<div className="flex items-center">
				<label
					htmlFor="destination"
					className="block font-medium text-gray-700">
					Destino:
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
				<button
					type="button"
					className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2">
					<img src={SendIcon} className="w-6 h-6 invert group-hover:invert-0" />
					<span className="sr-only">Icono de Enviar</span>
				</button>
				<button
					type="button"
					className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2">
					<img src={MapIcon} className="w-6 h-6 invert group-hover:invert-0" />
					<span className="sr-only">Icono de ubicar en el mapa</span>
				</button>
				<button
					type="button"
					className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2">
					<img src={GpsIcon} className="w-6 h-6 invert group-hover:invert-0" />
					<span className="sr-only">Icono de ubicar con GPS</span>
				</button>
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
