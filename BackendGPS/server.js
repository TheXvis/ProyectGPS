const express = require("express");
const cors = require("cors");
const http = require("http"); // Necesitamos http para crear el servidor
const { Server } = require("socket.io"); // Importar Server desde socket.io
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use(cors());
const port = 3000;
const users = {};
const tracking = {};

const server = http.createServer(app);

// Crear la instancia de Socket.IO
const io = new Server(server);

const userRoutes = require('./routes/userRoutes');
const carrierRoutes = require('./routes/carrierRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const cuponRoutes = require('./routes/cuponRoutes'); // Asegúrate de que esta ruta está definida correctamente
const reviewRoutes = require('./routes/reviewRoutes');

const User = require('./models/userModel');
const Carrier = require('./models/carrierModel');
const cupon = require('./models/cuponModel');

const uri = process.env.MONGODB_URI;

mongoose
	.connect(uri, {
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000,
		family: 4,
	})
	.then(() => console.log("Base de datos conectada"))
	.catch((e) => console.log(e));

app.use('/user', userRoutes);
app.use('/carrier', carrierRoutes);
app.use('/publication', publicationRoutes);
app.use('/images', express.static('images')); // Servir archivos estáticos desde la carpeta images
app.use('/cupon', cuponRoutes); // Asegúrate de que las rutas para los cupones están definidas correctamente
app.use('/review', reviewRoutes);

app.post("/login", async (req, res) => {
	try {
		let user = await User.findOne({ rut: req.body.rut });
		let userType = "user";

		if (!user) {
			console.log("rut:", req.body.rut);
			user = await Carrier.findOne({ rut: req.body.rut });
			userType = "carrier";
		}

		if (!user) {
			console.log("rut segundo:", req.body.rut);
			return res.status(400).json({ message: "User not found" });
		}
		console.log("user:", user);
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			return res.status(400).json({ message: "Invalid password" });
		}

		const token = jwt.sign(
			{ _id: user._id, role: userType },
			process.env.JWT_SECRET
		);
		res.status(200).json({ token: token, role: userType });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post("/registro", async (req, res) => {
	const { rut, password, Nombre, Apellido, Telefono, email } = req.body;

	const user = new User({ rut, password, Nombre, Apellido, email, Telefono });
	await user.save();

	res.status(201).send({ message: "User registered successfully" });
});

io.on("connection", (socket) => {
	// console.log("Usuario conectado");

	socket.on("join", ({ token }) => {
		users[token] = socket.id;
		io.emit("users", Object.keys(users));
	});


	socket.on('joinLocation', ({ id }) => {
        // console.log(`Cliente ${socket.id} se unió a la sala: ${id}`);
        socket.join(id);
    });


    socket.on('chat message', ({ message, token, partnerRut, userRut }) => {
      const partnerSocketId = users[partnerRut];
      if (partnerSocketId) {
        io.to(partnerSocketId).emit('chat message', {
          body: message,
          from: userRut,
          to: partnerRut,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Delivered'
        });
      }
    });
  socket.on('locationUpdate', ({ id, latitude, longitude, heading }) => {
    // console.log('locationUpdate', { id, latitude, longitude, heading });
    io.to(id).emit('locationUpdate', { id, latitude, longitude, heading });
});


  

  socket.on('join', ({ token, rut }) => {
    users[rut] = socket.id;
    io.emit('users', Object.keys(users));
  });

  socket.on('disconnect', () => {
    for (const [rut, id] of Object.entries(users)) {
      if (id === socket.id) {
        delete users[rut];
        break;
      }
    }
    io.emit('users', Object.keys(users));
  });

});

// app.listen(port, () => {
//   console.log(`Aplicación escuchando en http://localhost:${port}`);
// });
server.listen(port, () => {
	console.log(`Aplicación escuchando en http://localhost:${port}`);
});
