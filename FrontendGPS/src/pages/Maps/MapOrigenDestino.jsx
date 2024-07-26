import React, { useState } from "react";
import MapComponent from "../../components/mapComponents/mapTest";
import FormComponent from "../../components/mapComponents/FormComponent";

function MapPage() {
  const [originPosition, setOriginPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="w-full p-4">
        <FormComponent
          setOriginMarkerPosition={setOriginPosition}
          setDestinationMarkerPosition={setDestinationPosition}
        />
      </div>
      <div className="flex-1 p-4">
        <MapComponent
          originPosition={originPosition}
          destinationPosition={destinationPosition}
        />
      </div>
    </div>
  );
}

export default MapPage;
