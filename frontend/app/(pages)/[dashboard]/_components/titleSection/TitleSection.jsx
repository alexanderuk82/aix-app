import React from "react";

const TitleSection = ({ title, text }) => {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-4xl font-semibold">{title}</h2>
			<p className="font-normal">{text}</p>
		</div>
	);
};

export default TitleSection;
