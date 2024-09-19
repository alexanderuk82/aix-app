"use client";

import React from "react";
import { useTheme } from "../../../lib/ThemeContext";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
const Hero = () => {
	const { theme } = useTheme();
	return (
		<div>
			<div
				className="relative overflow-hidden bg-cover bg-no-repeat"
				style={{
					backgroundImage:
						theme === "dark"
							? "url('/imgHero-dark.jpg')"
							: "url('/imgHero-light.jpg')",
					height: "660px",
					backgroundPosition: "50%",
				}}
			>
				<div class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed relative">
					<div class="flex h-full items-center justify-center">
						<div class="px-2 text-center  md:px-12 flex flex-col gap-6 items-center">
							<div className="flex flex-col gap-4">
								<h1 class="mt-2 mb-16 text-4xl font-bold xl:leading-[5.5rem] md:text-6xl xl:text-7xl text-slate-800 dark:text-slate-100">
									Maximize Efficiency, Unleash <br />
									<span className="text text-teal-500">
										the Best in Your Research
									</span>
								</h1>
								<p className="md:text-2xl mt-[-3rem] px-3 xl:px-32 dark:text-white">
									Unlock UX insights with our AI, effortlessly revealing hidden
									needs and opportunities.
								</p>
							</div>
							<Button size="lg">
								Get Started
								<ChevronRight width={15} height={15} />
							</Button>

							<div className="md:mt-4 border rounded-lg border-yellow-200 bg-yellow-50 p-2 flex gap-3 mx-3 items-center">
								<Image src="./Pie-chart.svg" width={40} height={40} />
								<p className="text-left text-sm text-slate-800">
									Elevate Your Productivity and Extract the Best from Your
									Research
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="md:hidden mt-[-2.5rem] relative">
				<Image
					src="/imgHero-mobile.svg"
					width={350}
					height={400}
					alt="Mobile Hero"
					className="mx-auto mb-16 "
				/>
			</div>
			{/* This div will be shown on md screens and above, hiding the mobile image */}
			<div className="hidden md:block mt-[-2rem] relative">
				<Image
					src="/imageHero-desktop.svg"
					width={1260}
					height={600}
					alt="Desktop Hero"
					className="mx-auto mb-16"
				/>
			</div>
		</div>
	);
};

export default Hero;
