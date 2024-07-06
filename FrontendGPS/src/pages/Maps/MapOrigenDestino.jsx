import React, { useState } from "react";
import MapComponent from "../../components/mapComponents/mapTest";
import FormComponent from "../../components/mapComponents/FormComponent";

function MapPage() {
	const [originPosition, setOriginPosition] = useState(null);
	const [destinationPosition, setDestinationPosition] = useState(null);

	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen grid grid-cols-1 md:grid-cols-5">
			<div className="md:col-span-1"></div>
			<div className="md:col-span-4">
				<div className="p-4">
					<FormComponent
						setOriginMarkerPosition={setOriginPosition}
						setDestinationMarkerPosition={setDestinationPosition}
					/>
				</div>
				<MapComponent
					originPosition={originPosition}
					destinationPosition={destinationPosition}
				/>
			</div>
		</div>
	);
}

export default MapPage;
