// import CarrierForm from "../components/carrierComponents/carrierForm.jsx";
import CarrierList from "../components/carrierComponents/carrierList.jsx";
// import ModalComponent from "../components/carrierComponents/modalComponent.jsx";
import CarrierRegister from "../components/carrierComponents/carrierRegister.jsx";
import Modal from "../components/carrierComponents/modalComponent.jsx";
import { useState } from 'react';

const CarrierPage = () => {
    //constantes para que funcione el modal
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <h1 className="text-3xl font-semibold text-white">CarrierRegister</h1>
            <CarrierRegister />
            <h1 className="text-3xl font-semibold text-white">CarrierForm</h1>
            {/* <CarrierForm /> */}
            <h1 className="text-3xl font-semibold text-white">CarrierList</h1>
            <CarrierList />
            <h1 className="text-3xl font-semibold text-white">test modal</h1>
            <div className="container mx-auto mt-10">
                <button onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Abrir Modal
                </button>
                {showModal && (
                    <Modal isOpen={showModal} onClose={closeModal}>
                        <h2>Contenido del Modal</h2>
                        <p>Este es un ejemplo de contenido dentro del modal para la Página 1.</p>
                    </Modal>
                )}
            </div>

        </>
    );
};

export default CarrierPage;
