"use client";

import React, { useEffect } from "react";
import LottiePlayer from "@/components/ui/LottiePlayer";

const TestLottieComponent = () => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src =
			"https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
		script.type = "module";
		document.head.appendChild(script);
	}, []);

	return (
		<div>
			<h1>Test Page</h1>
			<h1>Test Page</h1>
			<LottiePlayer
				animationName="chatbubble"
				width="w-24"
				height="h-24"
				speed="0.8"
			/>
		</div>
	);
};

export default TestLottieComponent;
