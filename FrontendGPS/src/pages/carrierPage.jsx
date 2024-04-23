import CarrierForm from "../components/carrierComponents/carrierForm.jsx";
import CarrierList from "../components/carrierComponents/carrierList.jsx";
const CarrierPage = () => {
  
    return (
        <>
            <h1 className="text-3xl font-semibold text-white">CarrierForm</h1>
            <CarrierForm />
            <h1 className="text-3xl font-semibold text-white">CarrierList</h1>
            <CarrierList />
        </>
    )
}

export default CarrierPage;
