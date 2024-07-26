

function UserPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex">
      {/* <SideBar /> */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-5xl text-white font-bold mb-4">Bienvenido Usuario</h1>
          <p className="text-lg text-gray-300">Aquí puedes gestionar tus publicaciones y más</p>
        </div>
        {/* espaciador */}
        <div className="h-15  "></div>
        <div className="flex justify-center items-center space-x-6">
          <img src="src/assets/Portada/CamionPortada.png" alt="Camion" className="w-80 h-auto object-contain shadow-lg rounded-lg" />
          <img src="src/assets/Portada/RutaGPSPortada.png" alt="Ruta GPS" className="w-80  h-auto object-contain shadow-lg rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default UserPage;
