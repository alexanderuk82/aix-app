import LottiePlayer from "@/components/ui/LottiePlayer";
import { Lightbulb } from "lucide-react";
import React from "react";

const EmptyBox = () => {
	return (
		<div className="dark:text-neutral-50 text-center flex flex-col gap-3 justify-center items-center h-full ">
			<LottiePlayer
				animationName="empty"
				width="w-50"
				height="h-50"
				speed="0.8"
			/>
			{/* <Lightbulb width={50} height={50} /> */}
			<div className="flex flex-col items-center justify-center -mt-12">
				<p className="text-base font-semibold">It's Quiet Here for Now...</p>
				<p className="text-base font-normal">
					Start saving your content and watch this area come to life!
				</p>
			</div>
		</div>
	);
};

export default EmptyBox;
