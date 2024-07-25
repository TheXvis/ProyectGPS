import axios from "axios";

const fetchFuelPrice = async () => {
    try {
        const response = await axios.get(
            "https://api.bencinaenlinea.cl/api/estaciones/precios_combustibles/reporte_zonal"
        );
        let sumaPrecios = 0;
        let contador = 0;
        const fuelPrices = response.data;

        for (let i = 0; i < fuelPrices.data.length; i++) {
            const objeto = fuelPrices.data[i];
            if (objeto.combustible_nombre_largo == "Petroleo Diesel") {
                sumaPrecios += parseFloat(objeto.precio_promedio);
                contador++;
            }
        }

        if (contador > 0) {
            const promedio = sumaPrecios / contador;
            // console.log("Promedio de precios del diésel:", promedio);
            return promedio;
        } else {
            console.log("No se encontraron precios para Petroleo Diesel");
            return 0;
        }
    } catch (error) {
        console.error("Error fetching fuel prices:", error);
        return 0;
    }
};

export const calculatePrice = async (distance) => {
    const fuelPrice = await fetchFuelPrice(); //precio de un litro en pesos
    const fuelConsumption = 0.4; // Litros por kilómetro
    let price = fuelPrice * fuelConsumption * distance;
    // quitar decimales y multiplicar por 1.2
    price = price * 1.2;
    price = Math.round(price);
    
    
    //console.log("Distancia:", distance);
    return price;
};