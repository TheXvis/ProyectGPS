import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const LeafletRoutingMachine = ({ origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (origin && destination) {
      L.Routing.control({
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
    }
  }, [origin, destination, map]);

  return null;
};

export default LeafletRoutingMachine;
