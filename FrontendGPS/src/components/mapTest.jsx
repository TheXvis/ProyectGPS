import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "Leaflet/dist/Leaflet.css";


function MapComponent() {
    const mapRef = useRef(null);
    let mapInstance = null;

    function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    reject();
                }
            );
        } else {
            reject();
        }
    });
}


    useEffect(() => {
        getLocation().then(location => {
            if (!mapInstance) {
                mapInstance = L.map(mapRef.current).setView([location.lat, location.lng], 13);
    
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapInstance);
    
                // Invalida el tamaño después de 100ms
                setTimeout(() => {
                    mapInstance.invalidateSize();
                }, 100);
            }
        }).catch(() => {
            if (!mapInstance) {
                mapInstance = L.map(mapRef.current).setView([51.505, -0.09], 13);
    
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapInstance);
    
                // Invalida el tamaño después de 100ms
                setTimeout(() => {
                    mapInstance.invalidateSize();
                }, 100);
            }
        });
    }, []);

    return <div ref={mapRef} style={{ height: "100vh", width: "100%"}} />;
}


export default MapComponent;
