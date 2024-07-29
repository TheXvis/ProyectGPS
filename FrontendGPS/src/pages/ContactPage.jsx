import { useState } from "react";
import emailjs from "@emailjs/browser";


function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await emailjs.send(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				{
					name: formData.name,
					email: formData.email,
					message: formData.message,
				},
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			);
			alert("Mensaje enviado con éxito");
			setFormData({ name: "", email: "", message: "" });
		} catch (err) {
			console.error("Error al enviar el mensaje:", err);
			alert("Error al enviar el mensaje");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					Contáctanos
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-gray-700 dark:text-gray-300">
							Nombre
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-gray-700 dark:text-gray-300">
							Correo Electrónico
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="message"
							className="block text-gray-700 dark:text-gray-300">
							Mensaje
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							rows="4"
							required></textarea>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
						Enviar
					</button>
				</form>
			</div>
		</div>
	);
}

export default ContactPage;
