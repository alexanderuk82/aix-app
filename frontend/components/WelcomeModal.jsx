import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import LottiePlayer from "./ui/LottiePlayer";

const WelcomeModal = ({ run, handleTourCallback }) => {
	const router = useRouter();
	const [stepIndex, setStepIndex] = useState(0);
	const [runTour, setRunTour] = useState(run);

	const steps = [
		{
			target: "body", // Use a dummy target
			content: (
				<div className="flex flex-col items-center justify-center h-full">
					<LottiePlayer
						animationName="welcome"
						width="w-50"
						height="h-50"
						speed="0.5"
					/>
					<p className="text-3xl font-bold text-slate-800">
						Welcome to our app! Let’s take a quick tour.
					</p>
					<p className="mt-2">
						Discover how to start conducting impactful UX research for your
						interviews with our simple steps and expert AI advice.
					</p>
				</div>
			),
			placement: "center",
			disableBeacon: true // Ensure the step is highlighted immediately
		},
		{
			target: ".nav-add", // Ensure you have a className for the navbar button
			content: (
				<div className="flex flex-col ">
					<p className="text-xl font-bold text-slate-800">
						Start adding a new company
					</p>
					<p className="mt-2">
						This crucial step ensures all interview processes are saved for each
						company.
					</p>
				</div>
			)
		},
		{
			target: ".options", // Ensure you have a className for the navbar button
			content: (
				<div className="flex flex-col ">
					<p className="text-xl font-bold text-slate-800">Select the method</p>
					<p className="mt-2">
						Choose how to upload your interview content: either upload a file or
						paste the text directly into the box.
					</p>
				</div>
			)
		},
		{
			target: ".form-paste", // Ensure you have a className for the form paste target
			content: (
				<div className="flex flex-col ">
					<p className="text-xl font-bold text-slate-800">Paste the content</p>
					<p className="mt-2">
						Start by pasting the content of your interview into the box. You can
						also filter the results by selecting the appropriate option.
					</p>
				</div>
			)
		},
		{
			target: ".good-job", // Use a dummy target for the fifth step
			content: (
				<div className="flex flex-col items-center justify-center h-full">
					<LottiePlayer
						animationName="welldone"
						width="w-50"
						height="h-50"
						speed="0.2"
					/>
					<p className="text-3xl font-bold text-slate-800">Good Job!</p>
					<p className="mt-2">
						You now know the basic steps to start implementing your UX
						interviews with our AI assistant.
					</p>
					<button
						className="mt-4 px-4 py-2 bg-teal-600 text-white rounded"
						onClick={() => {
							localStorage.setItem("tourCompleted", "true");
							router.push("/dashboard");
						}}
					>
						Start Now
					</button>
				</div>
			),
			placement: "center",
			disableBeacon: true // Ensure the step is highlighted immediately
		}
	];

	const customStyles = {
		options: {
			zIndex: 10000
		},
		buttonNext: {
			backgroundColor: "#0D9488", // Your custom color for Next button
			color: "#fff",
			display: stepIndex === steps.length - 1 ? "none" : "inline-block" // Hide on last step
		},
		buttonBack: {
			color: "#6c757d", // Your custom color for Back button
			display: stepIndex === steps.length - 1 ? "none" : "inline-block" // Hide on last step
		},
		buttonSkip: {
			color: "#dc3545" // Your custom color for Skip button
		},
		tooltip: {
			textAlign: "center" // Center the text
		},
		tooltipContainer: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			height: "80%", // Full height to center vertically
			width: "auto" // Default width for all screens
		},
		tooltipArrow: {
			display: "none" // Hide the arrow
		}
	};

	const handleJoyrideCallback = (data) => {
		const { action, index, type, status } = data;

		if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
			if (index === 2 && action === ACTIONS.NEXT) {
				// Store the current step index in local storage before navigation
				localStorage.setItem("tourStepIndex", index + 1);
				// Navigate to the paste-text page
				router.push("/dashboard/paste-text");
			} else if (index === 3 && action === ACTIONS.PREV) {
				// Store the current step index in local storage before navigation
				localStorage.setItem("tourStepIndex", index - 1);
				// Navigate back to the dashboard page
				router.push("/dashboard");
			} else if (action === ACTIONS.NEXT) {
				setStepIndex(index + 1); // Increment stepIndex for the next step
			} else if (action === ACTIONS.PREV) {
				setStepIndex(index - 1); // Decrement stepIndex for the previous step
			}
		}

		// Handle tour end
		if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
			setStepIndex(0); // Reset the step index
			localStorage.removeItem("tourStepIndex"); // Clear the stored step index
		}

		// Call the parent callback if needed
		if (handleTourCallback) {
			handleTourCallback(data);
		}
	};

	useEffect(() => {
		const storedStepIndex = localStorage.getItem("tourStepIndex");
		const tourCompleted = localStorage.getItem("tourCompleted");
		if (storedStepIndex !== null && tourCompleted !== "true") {
			setStepIndex(parseInt(storedStepIndex, 10));
			localStorage.removeItem("tourStepIndex"); // Clear the stored step index
			setRunTour(true); // Start the tour after navigation
		}
	}, []);

	// Add styles to the Joyride tooltip container for the first and last steps
	useEffect(() => {
		const applyStyles = () => {
			const tooltips = document.querySelectorAll(".react-joyride__tooltip");
			tooltips.forEach((tooltip) => {
				const parentFloater = tooltip.closest(".__floater.__floater__open");
				if (stepIndex === 0 || stepIndex === steps.length - 1) {
					tooltip.style.width = "60%";
					tooltip.style.marginInline = "auto";
					if (parentFloater) {
						parentFloater.style.width = "90%";
					}
				} else {
					tooltip.style.width = "";
					tooltip.style.marginInline = "";
					if (parentFloater) {
						parentFloater.style.width = "";
					}
				}
			});
		};
		applyStyles();
		// Reapply styles when window is resized
		window.addEventListener("resize", applyStyles);
		return () => {
			window.removeEventListener("resize", applyStyles);
		};
	}, [stepIndex]);

	return (
		<Joyride
			steps={steps}
			stepIndex={stepIndex}
			continuous={true}
			showSkipButton={true}
			showProgress={true}
			run={runTour}
			callback={handleJoyrideCallback}
			styles={customStyles}
			locale={{
				last: "Start Now",
				back: "Back"
			}}
		/>
	);
};

export default WelcomeModal;
