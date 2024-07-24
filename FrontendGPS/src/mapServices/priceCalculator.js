// priceCalculator.js
import axios from "axios";

const fetchFuelPrice = async () => {
  try {
    const response = await axios.get(
      "https://api.bencinaenlinea.cl/api/estaciones/precios_combustibles/reporte_zonal"
    );
    const fuelPrices = response.data;

    const dieselPrices = [
      fuelPrices.norte.diesel,
      fuelPrices.centro.diesel,
      fuelPrices.metropolitana.diesel,
      fuelPrices.sur.diesel,
    ];

    const averageDieselPrice =
      dieselPrices.reduce((sum, price) => sum + price, 0) / dieselPrices.length;
    return averageDieselPrice * 1.05; // Add 5% to the average price
  } catch (error) {
    console.error("Error fetching fuel prices:", error);
    return 0;
  }
};

export const calculatePrice = async (distance) => {
  const fuelPrice = await fetchFuelPrice();
  const consumptionRate = 3; // Liters per km for a light truck
  const driverEarningsRate = 1.2; // 20% for the driver
  const companyEarningsRate = 1.3; // 30% for the company

  const fuelCost = distance * consumptionRate * fuelPrice;
  const driverEarnings = fuelCost * driverEarningsRate;
  const companyEarnings = fuelCost * companyEarningsRate;

  return fuelCost + driverEarnings + companyEarnings;
};
