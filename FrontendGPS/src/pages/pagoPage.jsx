import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';


function PagoPage  () {
  const [coupon, setCoupon] = useState();
  const [coupons, setCoupons] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false); // Añadido

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const rut = localStorage.getItem('rut');
      console.log('Valor de rut en localStorage:', rut); 
      setUserId(rut);
    }
  }, []);

  const handleGenerateCouponClick = async () => {
    console.log('handleGenerateCouponClick fue llamado');
    if (!userId) return;
    console.log('userId es válido:', userId);

    const amount = 1000;
  
    // Calcula la fecha de vencimiento
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const year = currentDate.getFullYear();
    const dueDate = `${day}-${month}-${year}`;
    console.log('Fecha de vencimiento calculada:', dueDate);
  
    // Crea el objeto FormData
    const data = {
      userId,
      amount,
      dueDate
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
      doc.text(`Fecha de vencimiento: ${data.dueDate}`, 20, 70);

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

  

  const handleShowCouponsClick = () => {
    setShowCoupons(!showCoupons);
  };

  return (
    <div style={{ padding: '20px', marginLeft: '250px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto 20px' }}>
        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={handleGenerateCouponClick}
          style={{ marginRight: '10px' }}
        >
          Generar cupón
        </button>
        <button
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={handleShowCouponsClick}
        >
          Ver cupones
        </button>
      </div>
      {coupon && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '10px' }}>Cupón generado</h2>
          <p><strong>UserId:</strong> {coupon.userId}</p>
          <p><strong>Amount:</strong> {coupon.amount}</p>
          <p><strong>DueDate:</strong> {new Date(coupon.dueDate).toLocaleDateString()}</p>
        </div>
      )}
      {showCoupons && (
        <div>
          <ul style={{ padding: '0', listStyleType: 'none' }}>
            {coupons.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((coupon, index) => {
              const dueDate = new Date(coupon.dueDate);
              return (
                <li key={coupon._id} style={{ marginBottom: '10px', backgroundColor: '#3b82f6', borderRadius: '10px', padding: '15px', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cupón {index + 1}: {coupon.amount}</div>
                  <div>Fecha de vencimiento: {dueDate.toLocaleDateString()}</div>
                  <div>Cuenta para transferir: {coupon.accountToTransfer}</div>
                  <div>Nombre de la cuenta: {coupon.accountName}</div>
                  <div>Estado: {coupon.isPaid ? 'Pagado' : 'No pagado'}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
export default PagoPage;