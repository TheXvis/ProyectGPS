/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const LeafletRoutingMachine = ({ origin, destination, onDistanceChange }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const [savedRoute, setSavedRoute] = useState(null);

  useEffect(() => {
    if (origin && destination && map && !routingControlRef.current) {
      if (savedRoute) {
        // Si hay una ruta guardada, dibujarla en el mapa
        const line = L.Routing.line(savedRoute, {
          styles: [
            { color: "blue", weight: 4, opacity: 0.7 }
          ]
        }).addTo(map);

        map.fitBounds(line.getBounds());

        // Calcular la distancia usando la ruta guardada
        const distanceInMeters = savedRoute.summary.totalDistance;
        const distanceInKilometers = distanceInMeters / 1000;
        if (onDistanceChange) {
          onDistanceChange(distanceInKilometers);
        }
      } else {
        // Calcular y guardar la ruta
        // console.log("Calculating route...");
        routingControlRef.current = L.Routing.control({
          language: "es",
          waypoints: [L.latLng(origin), L.latLng(destination)],
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
          showAlternatives: false,
        }).addTo(map);

        routingControlRef.current.on('routesfound', (e) => {
          const route = e.routes[0];
          setSavedRoute(route); // Guardar la ruta calculada
          const distanceInMeters = route.summary.totalDistance;
          const distanceInKilometers = distanceInMeters / 1000;

          console.log(`Calculated route distance: ${distanceInKilometers} km`);

          if (onDistanceChange) {
            onDistanceChange(distanceInKilometers);
          }
        });
      }
    }

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [origin, destination, map, onDistanceChange, savedRoute]);

  return null;
};

export default LeafletRoutingMachine;
