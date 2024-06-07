import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";
import LeafletGeocoder from "../../mapServices/LeafletGeocoder";
import LeafletRoutingMachine from "../../mapServices/LeafletRoutingMachine";
import getLocation from "../../mapServices/getLocation";
import React, { useState, useEffect } from 'react';

function MapComponent() {
  const [position, setPosition] = useState(null); // State to hold user's position
    // Obtener la posición desde getLocation
    useEffect(() => {
        getLocation()
        .then(coordinates => setPosition(coordinates))
        .catch(() => console.error("Error al obtener posición"));
    }, []);
    
    return (
        <>
        {position && (
            <div style={{ height: "75vh", width: "99%"}}>
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LeafletGeocoder />
                <LeafletRoutingMachine />
            </MapContainer>
            </div>
        )}
        </>
    );
}

let DefaultIcon = L.icon({
    iconUrl: "/mapIcons/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default MapComponent;
