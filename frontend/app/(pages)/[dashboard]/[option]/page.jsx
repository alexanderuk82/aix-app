"use client";

import React, { useEffect, useState } from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import TitleSection from "../_components/titleSection/TitleSection";
import PasteText from "./components/PasteText";
import UploadFile from "./components/UploadFile";

// const OptionPage = ({ params }) => {
// 	console.log(params);

// 	return (
// 		// Breadcumb component with links
// 		<main>
// 			<Breadcrumb className="my-3">
// 				<BreadcrumbList>
// 					<BreadcrumbItem>
// 						<BreadcrumbLink href="/">AIX Portal</BreadcrumbLink>
// 					</BreadcrumbItem>
// 					<BreadcrumbSeparator />
// 					<BreadcrumbItem>
// 						<BreadcrumbLink href="/dashboard" className="font-normal">
// 							{params.dashboard}
// 						</BreadcrumbLink>
// 					</BreadcrumbItem>
// 					<BreadcrumbSeparator />
// 					<BreadcrumbItem>
// 						<BreadcrumbLink className="font-normal">
// 							{params.option}
// 						</BreadcrumbLink>
// 					</BreadcrumbItem>
// 				</BreadcrumbList>
// 			</Breadcrumb>

// 			<TitleSection
// 				title={`Start now using ${params.option} option 🚀`}
// 				text="Get Started with Your Analysis 😀"
// 			/>
// 			<hr className="my-12 w-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />

// 			{params.option === "paste-text" ? <PasteText /> : <UploadFile />}
// 		</main>
// 	);
// };

// export default OptionPage;

import WelcomeModal from "@/components/WelcomeModal";

const OptionPage = ({ params }) => {
	const [stepIndex, setStepIndex] = useState(0);
	const [runTour, setRunTour] = useState(false);

	useEffect(() => {
		const storedStepIndex = localStorage.getItem("tourStepIndex");
		if (storedStepIndex !== null) {
			setStepIndex(parseInt(storedStepIndex, 10));
			localStorage.removeItem("tourStepIndex"); // Clear the stored step index
			setRunTour(true); // Start the tour
		}
	}, []);

	return (
		<main>
			<Breadcrumb className="my-3">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">AIX Portal</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard" className="font-normal">
							{params.dashboard}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink className="font-normal">
							{params.option}
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<TitleSection
				title={`Start now using ${params.option} option 🚀`}
				text="Get Started with Your Analysis 😀"
			/>
			<hr className="my-12 w-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />

			{params.option === "paste-text" ? <PasteText /> : <UploadFile />}

			<WelcomeModal run={runTour} handleTourCallback={() => {}} />
		</main>
	);
};

export default OptionPage;
