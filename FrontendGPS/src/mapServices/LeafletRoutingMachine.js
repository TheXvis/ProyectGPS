import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
// import { Control } from 'leaflet-routing-machine';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';


const LeafletRoutingMachine = () => {
  
  const map = useMap();
  let DefaultIcon = L.icon({
    iconUrl: "/mapIcons/cargo-truck.png",
    iconSize: [50, 50],
  });
  useEffect(() => {
    var marker1 = L.marker([-36.821123, -73.012784], { icon: DefaultIcon }).addTo(
      map
    );
    map.on("click", function (e) {
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      L.Routing.control({
        language: 'es',
        waypoints: [
          L.latLng(-36.821123, -73.012784),
          L.latLng(e.latlng.lat, e.latlng.lng),
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
    });
  }, []);
  return null;
};

export default LeafletRoutingMachine;
