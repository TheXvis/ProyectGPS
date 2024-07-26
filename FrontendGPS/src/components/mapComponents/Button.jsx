/* eslint-disable react/prop-types */
import SendIcon from "./../../assets/send.svg";
import GpsIcon from "./../../assets/gps.svg";
import MapIcon from "./../../assets/mapPoint.svg";

const icons = {
	send: SendIcon,
	map: MapIcon,
	gps: GpsIcon,
};

function Button({ iconSrc, title, onClick }) {
	return (
		<button
			type="button"
			className="group border border-gray-300 hover:bg-gray-300 focus:outline-none rounded-lg p-2.5 inline-flex items-center me-2"
			title={title}
			onClick={onClick}
		>
			<img src={icons[iconSrc]} className="w-6 h-6 invert group-hover:invert-0" alt={title} />
			<span className="sr-only">{title}</span>
		</button>
	);
}

export default Button;
