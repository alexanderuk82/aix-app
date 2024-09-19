//Responsive button sizes
"use client";

import { useState, useEffect } from "react";
const ResponsiveButton = () => {
	// Set the initial size
	const [buttonSize, setButtonSize] = useState("md");

	useEffect(() => {
		const handleResize = () => {
			setButtonSize(window.innerWidth < 580 ? "sm" : "lg");
		};

		// Set the initial size
		handleResize();

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Clean up event listener
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	return buttonSize;
};

export default ResponsiveButton;
