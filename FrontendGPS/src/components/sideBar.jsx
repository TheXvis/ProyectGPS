import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const handleLogout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("role");
	localStorage.removeItem("rut");
};

function SideBar() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [role, setRole] = useState(localStorage.getItem("role"));

	const sidebarRef = useRef(null);

	useEffect(() => {
		const userRole = localStorage.getItem("role");
		if (userRole) {
			setRole(userRole);
		}

		function handleClickOutside(event) {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target) &&
				!event.target.closest("#sidebarToggle")
			) {
				setIsSidebarOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div>
			{/* Navbar */}
			<nav className="bg-gray-800 p-4 text-white">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center flex-1">
						{/* Botón para alternar el sidebar */}
						<button
							id="sidebarToggle"
							onClick={toggleSidebar}
							className={`z-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors ${
								isSidebarOpen
									? "text-gray-800 bg-white"
									: "text-white bg-gray-800"
							}`}
							aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								{isSidebarOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
						
						{/* al pulsar en el titulo (App Fletes) este te envia al home */}
						<Link to="/usuario-home" className="flex items-center">App Flete</Link>

						{/* <span className="ml-4 text-xl font-semibold z-50">s</span> */}
					</div>
					<div className="flex-1 text-right">
						{/* Elemento central */}
						<Link
							to="/contacto"
							className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
							Contacto
						</Link>
					</div>
				</div>
			</nav>

			{/* Sidebar */}
			<aside
				ref={sidebarRef}
				className={`fixed top-0 left-0 z-40 w-80 h-screen pt-16 transition-transform transform ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} bg-white dark:bg-gray-800 overflow-y-auto`}
				aria-label="Sidebar">
				<div className="h-full px-3 py-4">
					<ul className="space-y-2 font-medium">
						{role === "user" && (
							<li>
								<button
									type="button"
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
									<svg
										className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 18 20">
										<path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
									</svg>
									<span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
										Publicaciones
									</span>
									<svg
										className="w-3 h-3"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 10 6">
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="m1 1 4 4 4-4"
										/>
									</svg>
								</button>
								{isDropdownOpen && (
									<ul id="dropdown-example" className="py-2 space-y-2">
										<li>
											<Link
												to="/crear-publicacion"
												className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
												Crear publicacion
											</Link>
										</li>
										<li>
											<Link
												to="/mis-publicaciones"
												className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
												Mis publicaciones
											</Link>
										</li>
									</ul>
								)}
							</li>
						)}
						{role === "carrier" && (
							<li>
								<Link
									to="/publicationlist"
									href="#"
									className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
									<svg
										className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 18">
										<path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
									</svg>
									<span className="flex-1 ms-3 whitespace-nowrap">
										Buscar viaje
									</span>
								</Link>
							</li>
						)}
						{role === "carrier" && (
							<li>
								<Link
									to="/misreviews"
									href="#"
									className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
									<svg
										className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 18">
										<path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
									</svg>
									<span className="flex-1 ms-3 whitespace-nowrap">
										Mis reseñas
									</span>
								</Link>
							</li>
						)}
						<li>
							<a
								href="#"
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
								<svg
									className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
								<span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
									3
								</span>
							</a>
						</li>
						<li>
							<Link
								to="/accountPage"
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
								<svg
									className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 18">
									<path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">Cuenta</span>
							</Link>
						</li>
						<li>
							<Link
								to="/pago"
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
								<svg
									className="w-6 h-6 text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="none"
									viewBox="0 0 24 24">
									<path
										stroke="currentColor"
										d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
									/>
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">Pagos</span>
							</Link>
						</li>
						<li>
							<button
								type="button"
								// abre solo esta seccion con ID 2
								onClick={() => handleDropdownToggle(2)}
								className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
								<svg
									className="w-6 h-6 text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 18 20">
									<path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
								</svg>
								<span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
									Carrier
								</span>
								<svg
									className="w-3 h-3"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 10 6">
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 4 4 4-4"
									/>
								</svg>
							</button>
							{/* abre solo esta seccion con ID 2 */}
							{openDropdownId === 2 && (
								<ul id="dropdown-example" className="py-2 space-y-2">
									<li>
										<Link
											to="/carrier-list"
											className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
											CarrierList
										</Link>
									</li>
									<li>
										<Link
											to="/carrier-register"
											className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
											CarrierRegister
										</Link>
									</li>
								</ul>
							)}
						</li>
						<li>
							<Link
								to="/"
								onClick={handleLogout}
								className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
								<svg
									className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 18 16">
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
									/>
								</svg>
								<span className="flex-1 ms-3 whitespace-nowrap">
									Cerrar Sesión
								</span>
							</Link>
						</li>
					</ul>
				</div>
			</aside>
		</div>
	);
}

export default SideBar;
