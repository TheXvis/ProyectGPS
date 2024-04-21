import React, { useState, useEffect } from "react";

function Direccion() {
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [originSuggestions, setOriginSuggestions] = useState([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState([]);
	const [location, setLocation] = useState(null);
	const [houseNumber, setHouseNumber] = useState(null);

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

	let timer;

	function fetchSuggestions(query, setSuggestions) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			let url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`;
			if (location) {
				const [lat, lon] = location;
				const viewbox = `${lon - 0.1},${lat + 0.1},${lon + 0.1},${lat - 0.1}`;
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
		}, 300);
	}

	function handleOriginInputChange(event) {
		const query = event.target.value;
		// busca numero de casa en el string query
		const houseNumberMatch = query.match(/\d+/);
		setHouseNumber(houseNumberMatch ? houseNumberMatch[0] : null); // Actualiza el estado de houseNumber
		setOrigin(query);
		fetchSuggestions(query, setOriginSuggestions);
	}

	function handleDestinationInputChange(event) {
		const query = event.target.value;
		setDestination(query);
		fetchSuggestions(query, setDestinationSuggestions);
	}

	function handleSuggestionClick(setInput, suggestion) {
		setInput(`${houseNumber} ${suggestion.display_name}`);
	}

    function handleOriginBlur() {
        setOriginSuggestions([]); // Limpia las sugerencias de origen cuando el campo de origen pierde el foco
    }

    function handleDestinationBlur() {
        setDestinationSuggestions([]); // Limpia las sugerencias de destino cuando el campo de destino pierde el foco
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
                    onBlur={handleOriginBlur}
				/>
				<ul className="suggestions">
					{originSuggestions.slice(0, 5).map((suggestion, index) => (
						<li
							key={index}
							className="suggestion"
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
                    onBlur={handleDestinationBlur} 
				/>
				<ul className="suggestions">
					{destinationSuggestions.slice(0, 5).map((suggestion, index) => (
						<li
							key={index}
							className="suggestion"
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
