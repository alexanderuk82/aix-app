// LottiePlayer.jsx
import React, { useEffect } from "react";
import dataLotties from "../../lib/dataLotties";

const LottiePlayer = ({ animationName, width, height, speed }) => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src =
			"https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
		script.type = "module";
		document.head.appendChild(script);
	}, []);

	const animationSrc = dataLotties[animationName];

	return (
		<div className={`relative ${width} ${height} `}>
			<dotlottie-player
				src={animationSrc}
				background="transparent"
				speed={speed}
				loop
				autoplay
			></dotlottie-player>
		</div>
	);
};

export default LottiePlayer;
