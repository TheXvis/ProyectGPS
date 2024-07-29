const express = require("express");
const cors = require("cors");
const http = require("http"); // Necesitamos http para crear el servidor
const { Server } = require("socket.io"); // Importar Server desde socket.io
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
const port = 3000;
const users = {};

const server = http.createServer(app);

// Crear la instancia de Socket.IO
const io = new Server(server);

const userRoutes = require("./routes/userRoutes");
const carrierRoutes = require("./routes/carrierRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const cuponRoutes = require("./routes/cuponRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const User = require("./models/userModel");
const Carrier = require("./models/carrierModel");
const cupon = require("./models/cuponModel");

require("dotenv").config();

const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

mongoose
	.connect(uri, {
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000,
		family: 4,
	})
	.then(() => console.log("Base de datos conectada"))
	.catch((e) => console.log(e));

app.use("/user", userRoutes);
app.use("/carrier", carrierRoutes);
app.use("/publication", publicationRoutes);
app.use("/images", express.static("images"));
app.use("/cupon", cuponRoutes);
app.use("/review", reviewRoutes);

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
	console.log("Usuario conectado");

	socket.on("join", ({ token }) => {
		users[token] = socket.id;
		io.emit("users", Object.keys(users));
	});

	socket.on("disconnect", () => {
		for (const [token, id] of Object.entries(users)) {
			if (id === socket.id) {
				delete users[token];
				break;
			}
		}
		io.emit("users", Object.keys(users));
	});

	// socket.on('chat message', (body) => {
	//   console.log('message: ' + body);
	//   socket.broadcast.emit('chat message', {
	//     body,
	//     from: socket.id.slice(4)
	//   });
	// });
	socket.on("chat message", ({ message, token, partnerToken }) => {
		const partnerSocketId = users[partnerToken];
		if (partnerSocketId) {
			io.to(partnerSocketId).emit("chat message", {
				body: message,
				from: token,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				status: "Delivered",
			});
		}
	});
	// seguimiento de ubicacion
	socket.on("locationUpdate", ({ id, latitude, longitude, heading }) => {
    console.log("locationUpdate", {id, latitude, longitude, heading });
    io.to(id).emit("locationUpdate", { id, latitude, longitude, heading });
});
});

// app.listen(port, () => {
//   console.log(`Aplicación escuchando en http://localhost:${port}`);
// });
server.listen(port, () => {
	console.log(`Aplicación escuchando en http://localhost:${port}`);
});
