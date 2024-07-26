function UserPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl text-white font-bold mb-4">
            Bienvenido Usuario
          </h1>
          <p className="text-md sm:text-lg text-gray-300">
            Aquí puedes gestionar tus publicaciones y más
          </p>
        </div>
        <div className="h-15"></div>
        <div className="flex flex-wrap justify-center items-center space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="w-60 sm:w-80 p-4 shadow-lg rounded-lg bg-gray-50 dark:bg-gray-800">
            <img
              src="src/assets/Portada/CamionPortada.png"
              alt="Camion"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          <div className="w-60 sm:w-80 p-4 shadow-lg rounded-lg bg-gray-50 dark:bg-gray-800">
            <img
              src="src/assets/Portada/RutaGPSPortada.png"
              alt="Ruta GPS"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
