import React from "react";
import { getSupabaseImageUrl } from "../utils/imageHelper";
import "../styles/personalDeLaAgencia.css";

const MIEMBROS_EJEMPLO = [
	{
		imagen: "imagenes/banner_principal.jpeg",
		alt: "Asesor de cruceros",
		titulo: "Asesor de Cruceros",
		descripcion:
			"Especialista en itinerarios y cabinas, te acompaña desde la cotización hasta el embarque.",
		items: ["Cruceros del Caribe", "Mediterráneo y Europa", "Asesoría personalizada"],
		links: [
			{ texto: "Contactar", href: "/contacto" },
			{
				texto: "WhatsApp",
				href: "https://wa.me/584142783669?text=Hola,%20quiero%20información%20sobre%20un%20viaje",
			},
		],
	},
	{
		imagen: "imagenes/banner_principal.jpeg",
		alt: "Especialista en tours",
		titulo: "Especialista en Tours",
		descripcion:
			"Diseña tours nacionales e internacionales a la medida de tu presupuesto y fechas.",
		items: ["Tours nacionales", "Vuelos y hoteles", "Paquetes todo incluido"],
		links: [
			{ texto: "Contactar", href: "/contacto" },
			{ texto: "Ver destinos", href: "/destinos" },
		],
	},
];

const PersonalDeLaAgencia = ({ miembros = MIEMBROS_EJEMPLO }) => (
	<div className="staff-grid">
		{miembros.map((miembro, index) => (
			<article className="card staff-card" key={`${miembro.titulo}-${index}`}>
				<img
					src={getSupabaseImageUrl(miembro.imagen)}
					className="card-img-top"
					alt={miembro.alt || miembro.titulo}
					loading="lazy"
				/>
				<div className="card-body">
					<h5 className="card-title">{miembro.titulo}</h5>
					<p className="card-text">{miembro.descripcion}</p>
				</div>
				<ul className="list-group list-group-flush">
					{miembro.items.map((item) => (
						<li className="list-group-item" key={item}>
							{item}
						</li>
					))}
				</ul>
				<div className="card-body">
					{miembro.links.map((link) => (
						<a
							key={link.texto}
							href={link.href}
							className="card-link"
							target={link.href.startsWith("http") ? "_blank" : undefined}
							rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
						>
							{link.texto}
						</a>
					))}
				</div>
			</article>
		))}
	</div>
);

export default PersonalDeLaAgencia;
