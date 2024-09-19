// middleware.js
import { NextResponse } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

// Esta función verificará el referente para la página de resultados
function checkReferrer(request) {
	const referrer = request.headers.get("referer");
	const path = new URL(request.url).pathname;

	// Aplica la comprobación solo en la ruta específica
	if (path.includes("/results") && referrer) {
		return (
			referrer.includes("/paste-text") || referrer.includes("/upload-audio")
		);
	} else {
		return NextResponse.redirect(new URL("/not-found", request.url));
	}

	// Si no es la página de resultados, permitir acceso
	return true;
}

export function middleware(request) {
	const authResponse = withAuth(request);

	// Primero verifica la autenticación
	if (authResponse.status === NextResponse.next().status) {
		// Luego verifica el referente si el usuario está autenticado
		const isReferrerValid = checkReferrer(request);
		if (!isReferrerValid) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return authResponse;
}

export const config = {
	matcher: [
		"/dashboard/",
		"/interview/",
		"/inserting/",
		"/results/",
		"/status/",
		"/[dashboard]/_components/sidebar/SideBar",
		"/[dashboard]/_components/sidebar/_components/ContentBox"
	]
};
