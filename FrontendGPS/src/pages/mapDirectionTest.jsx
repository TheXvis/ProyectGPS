import MapComponent from "../components/mapTest";
import React from "react";
import Direccion from "../components/autocompletadoDirecciones";

function MapPage() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen grid grid-cols-1 md:grid-cols-5">
			<div className="md:col-span-1"></div>
			<div className="md:col-span-4">
				<div className="p-4">
					<Direccion />
				</div>
				<MapComponent />
			</div>
		</div>
	);
}

export default MapPage;
