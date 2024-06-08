import React from "react";
import Button from "./Button";

function InputField({ id, placeholder, value, setValue }) {
	const handleInputChange = (event) => {
		setValue(event.target.value);
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
			<Button iconSrc="send" title="Enviar dirección" />
			<Button iconSrc="map" title="Ubicar en el mapa" />
			<Button iconSrc="gps" title="Ubicar con GPS" />
		</div>
	);
}

export default InputField;
