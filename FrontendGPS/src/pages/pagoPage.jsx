import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function PagoPage() {
  const [coupon, setCoupon] = useState();
  const [coupons, setCoupons] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [searchRut, setSearchRut] = useState('');
  const [adminCoupons, setAdminCoupons] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const rut = localStorage.getItem('rut');
      const role = localStorage.getItem('role'); // Obtener el rol del usuario
      console.log('Valor de rut en localStorage:', rut);
      console.log('Rol del usuario:', role);
      setUserId(rut);
      setUserRole(role); // Establecer el rol del usuario
    }
  }, []);
  


  const handleGenerateCoupon = async () => {
    const amount = 20000;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const dueDateString = dueDate.toISOString();

    const data = {
      userId,
      amount,
      dueDate: dueDateString,
    };

    try {
      const response = await axios.post('http://localhost:3000/cupon', data);
      setCoupon(response.data);
      const doc = new jsPDF();

      // Titulo
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Cupón de Pago', 105, 30, null, null, 'center');

      // Linea para separar
      doc.setLineWidth(1);
      doc.line(20, 35, 190, 35);

      // Detalles del cupón
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Cupón generado para el usuario: ${data.userId}`, 20, 50);
      doc.text(`Monto: ${data.amount}`, 20, 60);
      const formattedDueDate = new Date(data.dueDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      doc.text(`Fecha de vencimiento: ${formattedDueDate}`, 20, 70);

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Datos para pagar', 105, 90, null, null, 'center');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Cuenta a transferir: ${response.data.accountToTransfer}`, 20, 110);
      doc.text(`Nombre de la cuenta: ${response.data.accountName}`, 20, 120);

      doc.setLineWidth(0.5);
      doc.line(20, 125, 190, 125);

      // Pie de página
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Este es un cupón de pago generado automáticamente.', 105, 130, null, null, 'center');

      doc.save(`Cupon_${data.userId}.pdf`);
    } catch (error) {
      console.error(`Error al generar el cupón: ${error}`);
    }
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cupon');
        setCoupons(response.data);
      } catch (error) {
        console.error(`Error al obtener los cupones: ${error}`);
      }
    };

    if (userId) {
      fetchCoupons();
    }
  }, [userId]);

  const handleShowCoupons = () => {
    setShowCoupons(!showCoupons);
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/cupon/${couponId}`);
      if (response.status === 200) {
        // Recargar los cupones después de eliminar uno
        setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      } else {
        console.error('Error al eliminar el cupón');
      }
    } catch (error) {
      console.error('Error al eliminar el cupón', error);
    }
  };

  const handleSearchByRut = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/cupon?userId=${searchRut}`);
      setAdminCoupons(response.data);
    } catch (error) {
      console.error(`Error al buscar cupones por RUT: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px', marginLeft: '250px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto 20px' }}>
        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={handleGenerateCoupon}
          style={{ marginRight: '10px' }}
        >
          Generar cupón
        </button>
        <button
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={handleShowCoupons}
        >
          Ver cupones
        </button>
      </div>
      {coupon && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '10px' }}>Cupón generado</h2>
          <p><strong>Id:</strong> {coupon._id}</p>
          <p><strong>Rut:</strong> {coupon.userId}</p>
          <p><strong>Monto:</strong> {coupon.amount}</p>
          <p><strong>Fecha de Vencimiento</strong>: {new Date(coupon.dueDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}</p>
        </div>
      )}
      {showCoupons && (
        <div>
          <ul style={{ padding: '0', listStyleType: 'none' }}>
            {coupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
              const dueDate = new Date(coupon.dueDate);
              return (
                <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón {index + 1}: {coupon._id}</div>
                  <div>Rut: {coupon.userId}</div>
                  <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                  <div>Monto: {coupon.amount}</div>
                  <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon._id)}
                     className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                     <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                     </svg>
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Eliminar</span>
                  </button>

                </li>
              );
            })}
          </ul>
        </div>
      )}
      {userRole === 'admin' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Buscar cupones por RUT</h3>
          <input
            type="text"
            value={searchRut}
            onChange={(e) => setSearchRut(e.target.value)}
            placeholder="Ingrese RUT"
            style={{ padding: '10px', borderRadius: '5px', marginRight: '10px' }}
          />
          <button
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={handleSearchByRut}
          >
            Buscar
          </button>
          {adminCoupons.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4>Resultados de la búsqueda</h4>
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {adminCoupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
                  const dueDate = new Date(coupon.dueDate);
                  return (
                    <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón {index + 1}: {coupon._id}</div>
                      <div>Rut: {coupon.userId}</div>
                      <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                      <div>Monto: {coupon.amount}</div>
                      <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PagoPage;
