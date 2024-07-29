import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import LeafletRoutingMachine from "../../mapServices/LeafletRoutingMachine";
import io from "socket.io-client";
import L from "leaflet"; // Importar Leaflet
import TruckIcon from "../../assets/truck.svg";


// Crear un nuevo icono usando el SVG de TruckIcon
const currentLocationIcon = new L.Icon({
    iconUrl: TruckIcon,
    iconSize: [38, 38], // Ajustar el tamaño del icono según sea necesario
    iconAnchor: [19, 19], // Ajustar el ancla del icono según sea necesario
    popupAnchor: [0, -19], // Ajustar el ancla del popup según sea necesario
});

function NavigationPage() {
    const { id } = useParams();
    const [publication, setPublication] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [heading, setHeading] = useState(0);
    const socketRef = useRef(null);
    const [previousDistance, setPreviousDistance] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(13); // Estado para manejar el nivel de zoom

    useEffect(() => {
        const fetchPublication = async () => {
            const response = await fetch(
                `http://localhost:3000/publication/buscar/${id}`
            );
            const data = await response.json();
            setPublication(data);
        };

        fetchPublication();
    }, [id]);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("/");
            // join
            socketRef.current.emit("join", { token: localStorage.getItem("token") });
        }

        const updatePosition = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude, heading } = position.coords;
                        const newPosition = [latitude, longitude];
                        setCurrentPosition(newPosition);
                        if (heading !== null) {
                            setHeading(heading);
                        }
                        // Enviar la ubicación actual al servidor a través del socket
                        socketRef.current.emit("locationUpdate", {id, latitude, longitude, heading});
                    },
                    (error) => {
                        console.error("Error obteniendo la ubicación:", error);
                    }
                );
            } else {
                console.error("Geolocalización no es soportada por este navegador.");
            }
        };

        // Actualizar la ubicación cada 10 segundos
        const intervalId = setInterval(updatePosition, 10000);
        // Obtener la ubicación inicial
        updatePosition();

        // Limpiar el intervalo y la conexión de socket al desmontar el componente
        return () => {
            clearInterval(intervalId);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    if (!publication) return <div>Loading...</div>;

    const { ubicacionCarga, ubicacionDescarga } = publication;
    const initialCargaPosition = JSON.parse(ubicacionCarga);
    const initialDescargaPosition = JSON.parse(ubicacionDescarga);
    
    const handleDistanceChange = (distance) => {
        if (distance !== previousDistance) {
            // console.log(`Distance: ${distance} km`);
            setPreviousDistance(distance);
        }
    };

    const MapUpdater = () => {
        const map = useMap();

        useEffect(() => {
            if (currentPosition) {
                // console.log("posición actual: ",currentPosition);
                map.setView(currentPosition, zoomLevel, {
                    animate: true,
                    duration: 1,
                });
                map.getPane('mapPane').style.transform = `rotate(${heading}deg)`;
            }
        }, [map]);

        return null;
    };

    const handleZoomToCurrentLocation = () => {
        setZoomLevel(16);
    };

    const handleZoomToFullPath = () => {
        setZoomLevel(13);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Navegación GPS
            </h2>
            <div className="mb-4">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleZoomToCurrentLocation}
                >
                    Ver Ubicación Actual
                </button>
                <button 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleZoomToFullPath}
                >
                    Ver Camino Completo
                </button>
            </div>
            <MapContainer
                center={initialCargaPosition}
                zoom={zoomLevel}
                style={{ height: "60vh", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={initialCargaPosition}>
                    <Popup>Origen</Popup>
                </Marker>
                <Marker position={initialDescargaPosition}>
                    <Popup>Destino</Popup>
                </Marker>
                {currentPosition && (
                    <Marker position={currentPosition} icon={currentLocationIcon}>
                        <Popup>Ubicación Actual</Popup>
                    </Marker>
                )}
                <LeafletRoutingMachine
                    origin={initialCargaPosition}
                    destination={initialDescargaPosition}
                    onDistanceChange={handleDistanceChange}
                />
                <MapUpdater />
            </MapContainer>
        </div>
    );
}

export default NavigationPage;