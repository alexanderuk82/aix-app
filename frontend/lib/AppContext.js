"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
	const [textData, setTextData] = useState("");
	console.log("textData", textData);
	return (
		<AppContext.Provider value={{ textData, setTextData }}>
			{children}
		</AppContext.Provider>
	);
};
