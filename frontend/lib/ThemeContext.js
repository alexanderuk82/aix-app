// "use client";
// import React, { createContext, useContext, useState, useEffect } from "react";

// const ThemeContext = createContext({
// 	theme: "light",
// 	toggleTheme: () => {},
// });

// export const ThemeProvider = ({ children }) => {
// 	const [theme, setTheme] = useState(() => {
// 		const localTheme = window.localStorage.getItem("theme");
// 		return localTheme ?? "light";
// 	});

// 	useEffect(() => {
// 		const root = window.document.documentElement;

// 		root.classList.remove(theme === "light" ? "dark" : "light");
// 		root.classList.add(theme);

// 		window.localStorage.setItem("theme", theme);
// 	}, [theme]);

// 	const toggleTheme = () => {
// 		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
// 	};

// 	const value = { theme, toggleTheme };

// 	return (
// 		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
// 	);
// };

// export const useTheme = () => useContext(ThemeContext);
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
	theme: "light",
	toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("light"); // Estado inicial sin acceso a window

	useEffect(() => {
		// Acceso a localStorage solo en el lado del cliente
		const localTheme = window.localStorage.getItem("theme");
		if (localTheme) {
			setTheme(localTheme);
		}
	}, []); // Se ejecuta solo una vez, al montar el componente

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove(theme === "light" ? "dark" : "light");
		root.classList.add(theme);

		window.localStorage.setItem("theme", theme);
	}, [theme]); // Actualiza el tema en localStorage y la clase en el DOM cuando cambia

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	const value = { theme, toggleTheme };

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
