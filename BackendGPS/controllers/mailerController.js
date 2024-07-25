import nodemailer from 'nodemailer';

const enviarCorreo = (solicitud, usuario) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          
        },
      });

      let asunto = '';
      let contenido = '';
    
      // Personaliza el asunto y el contenido del correo en función del estado
      if (solicitud.estado === 'creado') {
        asunto = 'Solicitud Aprobada'; 
        contenido = 'La solicitud ha sido creada.';
      } else if (solicitud.estado === 'completado') {
        asunto = 'Solicitud Completada';
        contenido = 'Su solicitud ha sido completada con éxito';
      } else if (solicitud.estado === 'rechazado') {
        asunto = 'Solicitud Rechazada';
        contenido = 'La solicitud ha sido rechazada.';
      } 

      const mailOptions = {
        from: 'Fletes <Fletes@gmail.com>',
        to: usuario.email,
        subject: asunto,
        text: contenido,
    
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
        } 
      });
}

export default enviarCorreo;