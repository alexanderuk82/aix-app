"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { SunMedium, MoonStar } from "lucide-react";

const ThemeSwitcher = () => {
	const { theme, toggleTheme } = useTheme(); // Obtenemos el tema actual y la función para alternarlo

	return (
		<button onClick={toggleTheme} className="cursor-pointer">
			{theme === "light" ? (
				<MoonStar className="text-slate-800" width={20} height={20} />
			) : (
				<SunMedium className="text-white" width={20} height={20} />
			)}
		</button>
	);
};

export default ThemeSwitcher;
