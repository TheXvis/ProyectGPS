// LeafletRoutingMachine.jsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const LeafletRoutingMachine = ({ origin, destination, onDistanceChange }) => {
  const map = useMap();

  useEffect(() => {
    if (origin && destination) {
      const routingControl = L.Routing.control({
        language: "es",
        waypoints: [
          L.latLng(origin), // Origen
          L.latLng(destination), // Destino
        ],
        lineOptions: {
          styles: [
            {
              color: "blue",
              weight: 4,
              opacity: 0.7,
            },
          ],
        },
        routeWhileDragging: false,
        geocoder: L.Control.Geocoder.nominatim(),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: true,
      }).addTo(map);
      
      routingControl.on('routesfound', function (e) {
        const route = e.routes[0];
        const distanceInMeters = route.summary.totalDistance; // Distancia en metros
        const distanceInKilometers = distanceInMeters / 1000; // Convertir a kilómetros

        console.log(`Calculated route distance: ${distanceInKilometers} km`); // Imprimir la distancia calculada

        // Llamar a la función de callback para actualizar el estado en el componente padre
        if (onDistanceChange) {
          onDistanceChange(distanceInKilometers);
        }
      });

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [origin, destination, map, onDistanceChange]);

  return null;
};

export default LeafletRoutingMachine;
