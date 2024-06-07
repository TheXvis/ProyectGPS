import React, { useRef } from "react";
import Button from "./Button";

function InputField({
	id,
	placeholder,
	value,
	setValue,
	suggestions,
	setSuggestions,
	fetchSuggestions,
	location,
	houseNumber,
	setHouseNumber,
}) {
	const timer = useRef(null);

	const handleInputChange = (event) => {
		var query = event.target.value;
		var houseNumberMatch = query.match(/\d+/);
		setHouseNumber(houseNumberMatch ? houseNumberMatch[0] : "");
		setValue(query);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			query = query.replace(/\s/g, "%20");
			fetchSuggestions(query, setSuggestions);
		}, 1500);
	};

	const handleSuggestionClick = (suggestion) => {
		setValue(`${houseNumber} ${suggestion.display_name}`);
	};

	const handleBlur = () => {
		setTimeout(() => {
			setSuggestions([]);
		}, 200);
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
				onBlur={handleBlur}
			/>
			<Button iconSrc="send" title="Enviar dirección" />
			<Button iconSrc="map" title="Ubicar en el mapa" />
			<Button iconSrc="gps" title="Ubicar con GPS" />
			<ul className="absolute top-full left-0 w-full bg-white z-10">
				{suggestions.slice(0, 5).map((suggestion, index) => (
					<li
						key={index}
						className="suggestion gb-white-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
						onClick={() => handleSuggestionClick(suggestion)}>
						{`${houseNumber} ${suggestion.display_name}`}
					</li>
				))}
			</ul>
		</div>
	);
}

export default InputField;
