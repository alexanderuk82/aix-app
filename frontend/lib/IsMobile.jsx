import { useState, useEffect } from "react";

export const useIsMobile = () => {
	// Initialize state with undefined so it matches the server-rendered markup initially
	const [isMobile, setIsMobile] = useState(undefined);

	useEffect(() => {
		// Define the function inside useEffect where window is available
		const checkIfMobile = () => window.innerWidth < 768;

		// Set the initial value
		setIsMobile(checkIfMobile());

		// Set up event listener for window resize
		const handleResize = () => {
			setIsMobile(checkIfMobile());
		};

		window.addEventListener("resize", handleResize);

		// Clean up the event listener when the component unmounts
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return isMobile;
};
