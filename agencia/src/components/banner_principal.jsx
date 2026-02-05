import React from "react";
import '../styles/banner_principal.css';
import '../styles/landing.css';



const BannerPrincipal = ({ children }) => {
	return (
		<header
			className="position-relative"
			style={{
				backgroundImage:
				"linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(/src/imagenes/banner_principal.jpeg)",
				backgroundSize: "cover",
				backgroundPosition: "center 10%",
				backgroundRepeat: "no-repeat",
				minHeight: "400px",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{children}

			{/* Hero Central */}
			<div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3">
				<h1
					className="display-2 text-white fw-bold mb-3"
					style={{
						fontFamily: "'Chicago Police', sans-serif",
						textShadow: "4px 4px 16px rgba(0, 0, 0, 0.5)",
						letterSpacing: "1px",
						fontSize: "3rem",
					}}
				>
					 CRUCEROS Y TOURS: TU PRÓXIMA AVENTURA COMIENZA AQUÍ.
				</h1>
				<p
					className="lead text-white mb-5"
					style={{
						fontFamily: "'Lora', serif",
						fontSize: "2rem",
						opacity: "0.95",
						textShadow: "4px 4px 16px rgba(0, 0, 0, 0.5)",
					}}
				>
					Desde el Caribe hasta el Mediterráneo, nosotros te llevamos
				</p>

				<a href="#" className="btn_banner_principal btn_banner_principal__wrapper">Ver Ofertas del Mes</a>
			</div>

			{/* Curvas decorativas (Wave Shape) */}
			<div
				className="position-absolute bottom-0 w-100"
				style={{ marginBottom: "-1px", lineHeight: 0, paddingBottom: "0px" }}
			>
				<svg
					viewBox="0 0 1440 120"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{ width: "100%", height: "auto", display: "block" }}
				>
					<path
						d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
						fill="#ffffff"
					/>
				</svg>
			</div>
		</header>
	);
};

export default BannerPrincipal;
