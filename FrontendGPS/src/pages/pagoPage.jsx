import React, { useState } from 'react';
import axios from 'axios';
import { generateCoupon } from '../../../BackendGPS/controllers/cuponController';

const PagoPage = () => {
   
  const [coupon, setCoupon] = useState(null);
  const handleGenerateCouponClick = async () => {
    const rutUser = localStorage.getItem('rut');
    
    const formData = new FormData();
    
    formData.append('userId', userId);
    formData.append('amount', amount);
    formData.append('dueDate', dueDate);
  
    try {
      const response = await axios.post('http://localhost:3000/cupon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCoupon(response.data);
    } catch (error) {
      console.error('Error al generar el cupón:', error);
    }
  };
  return (
    <div>
       <button type="submit"
      className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      onClick={handleGenerateCouponClick}>Generar cupón</button>

      {coupon && (
        <div>
          <h2>Cupón generado</h2>
          <p>UserId: {coupon.userId}</p>
          <p>Amount: {coupon.amount}</p>
          <p>DueDate: {coupon.dueDate}</p>
        </div>
      )}
    </div>
  );
};

export default PagoPage;

