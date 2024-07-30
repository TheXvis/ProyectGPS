import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import EditPublicationForm from '../../components/userComponents/editPublicationForm';
import ReseñaForm from '../../components/userComponents/reseñaForm';


const sendEmail = (templateId, variables) => {
  emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId,
    variables,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  )
  .then((response) => {
    console.log('Correo enviado exitosamente:', response.status, response.text);
  })
  .catch((err) => {
    console.error('Error al enviar el correo:', err);
  });
};


function PublicationDetailsPage() {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublication = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/buscar/${id}`);
      const data = await response.json();
      setPublication(data);
    };

    fetchPublication();
  }, [id]);

  // Funciones del carrier
  const solucitarPublicacion = async () => {
    const carrierRut = localStorage.getItem('rut').replace(/[.-]/g, '');
    const userEmail = (publication?.userEmail || 'correoDesconocido@example.com').trim();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/carrier/aceptar/${id}/${carrierRut}`, {
      method: 'PUT',
    });
  
    if (response.ok) {
      const carrierNombre = localStorage.getItem('nombre');
      const carrierApellido = localStorage.getItem('apellido');
      const userEmail = publication.userEmail;
  
      console.log('Enviando correo a:', userEmail);
      console.log('Nombre del Carrier:', carrierNombre);
      console.log('Apellido del Carrier:', carrierApellido);
  
      sendEmail(
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_email: userEmail,
          carrier_nombre: carrierNombre,
          carrier_apellido: carrierApellido,
          publication_nombre: publication.nombre,
        }
      );
  
      alert('Publicación solicitada con éxito');
    } else {
      alert('Error al solicitar la publicación');
    }
  };
  
  

  const iniciarViaje = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/inicioviaje/${id}`, {
      method: 'PUT',
    });

    if (response.ok) {
      alert('Viaje comenzado con exito');
      console.log(id);
      navigate(`/navegacion/${id}`);
    } else {
      alert('Error al comenzar el viaje');
    }
  };

  const finalizarViaje = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/finviaje/${id}`, {
      method: 'PUT',
    });

    if (response.ok) {
      alert('Viaje finalizado con éxito');
    } else {
      alert('Error al finalizar el viaje');
    }
  };

  // Funciones del user
  const deletePublication = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/borrar/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      navigate('/usuario-home');
    } else {
      alert('Error al eliminar la publicación');
    }
  };

  const cancelarPublicacion = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/cancelar/${id}`, {
      method: 'PUT',
    });
    if (response.ok) {
      alert('Publicación cancelada con éxito');
    } else {
      alert('Error al cancelar la publicación');
    }
  };

  const aceptarPublicacion = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/publication/aceptar/${id}`, {
      method: 'PUT',
    });
    if (response.ok) {
      alert('Publicación aceptada con éxito');
    } else {
      alert('Error al aceptar la publicación');
    }
  };

  const handlePay = () => {
    window.location.href = 'http://localhost:5173/pago';
  };

  if (!publication) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-col justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sm:p-10 inline-block text-center">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{publication.nombre}</h5>
        <img src={`${import.meta.env.VITE_API_URL}/${publication.imagen}`} alt={publication.nombre} className="mx-auto w-1/4 mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400" />
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Inicio: {publication.ubicacionCarga}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Destino: {publication.ubicacionDescarga}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Precio: {publication.precio}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Tipo de mercancia: {publication.tipoMercancia}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Peso: {publication.peso}</p>
        <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Estado: {publication.estado}</p>

        {userRole === 'carrier' && publication.estado.trim() === 'Disponible' && (
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={solucitarPublicacion}>
            Solicitar Publicación
          </button>
        )}
        {userRole === 'carrier' && publication.estado.trim() === 'Aceptado' && (
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={iniciarViaje}>
            Iniciar viaje
          </button>
        )}
        {userRole === 'carrier' && publication.estado.trim() === 'En transito' && (
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={finalizarViaje}>
            Finalizar viaje
          </button>
        )}
        {userRole === 'user' && (
          <>
            <button onClick={deletePublication} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Eliminar publicación</button>
            <div>
              <EditPublicationForm />
            </div>
          </>
        )}
        {userRole === 'user' && publication.estado.trim() === 'Finalizado' && (
          <div>
            <ReseñaForm />
          </div>
        )}
        {userRole === 'user' && publication.estado.trim() === 'Pendiente' && (
          <div className="justify-center bg-white dark:bg-gray-800 p-2 shadow inline-block text-center mt-4 ml-21 items-center">
            <div>
              <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">RUT del Carrier: {publication.rutCarrier}</p>
              <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Nombre: {publication.nombreCarrier}</p>
              <button onClick={aceptarPublicacion} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Aceptar
              </button>
              <button onClick={cancelarPublicacion} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Cancelar
              </button>
            </div>
          </div>
        )}
        {userRole === 'user' && (
          <button onClick={handlePay} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Pagar
          </button>
        )}
      </div>
    </div>
  );
}

export default PublicationDetailsPage;
