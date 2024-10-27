"use client";

"use client";

import React, { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import TitleSection from "./_components/titleSection/TitleSection";
import GlobalApi from "@/lib/GlobalApi";
import BoxNotification from "./_components/boxnotification/BoxNotification";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import BoxOption from "./_components/boxOption/BoxOption";
import WelcomeModal from "@/components/WelcomeModal";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const DashboardPage = () => {
	const { user } = useKindeBrowserClient();

	const { toast } = useToast();
	const [uxDesigner, setUxDesigner] = useState();

	const [isLoading, setIsLoading] = useState(true);

	// These will be counts of interviews by status
	const [completedCount, setCompletedCount] = useState(0);
	const [inProgressCount, setInProgressCount] = useState(0);
	const [underReviewCount, setUnderReviewCount] = useState(0);

	const [showTour, setShowTour] = useState(false); // State to control the tour visibility

	const fetchUserDetails = async () => {
		setIsLoading(true); // Start loading
		try {
			const response = await GlobalApi.getUserByEmail(user?.email);
			const userData = response.data.data[0] || null;

			if (userData) {
				setUxDesigner(userData);

				toast({
					title: "Hi there! 🎉",
					description: "Content loaded successfully!"
				});

				// Initialize counters
				let completed = 0;
				let inProgress = 0;
				let underReview = 0;

				// Count interviews by status
				userData.attributes?.statuses?.data.forEach((statusItem) => {
					switch (statusItem.attributes.status) {
						case "completed":
							completed++;
							break;
						case "in-progress":
							inProgress++;
							break;
						case "under-review":
							underReview++;
							break;
						default:
							// Handle any other case if needed
							break;
					}
				});

				// Set counts
				setCompletedCount(completed);
				setInProgressCount(inProgress);
				setUnderReviewCount(underReview);

				// Check if user has no interviews and show the tour
				if (completed === 0 && inProgress === 0 && underReview === 0) {
					const tourCompleted = localStorage.getItem("tourCompleted");
					if (tourCompleted !== "true") {
						setTimeout(() => {
							setShowTour(true); // Show the tour after 5 seconds
						}, 800);
					}
				}
			} else {
				toast({
					title: "Welcome Aboard! 🚀",
					description: "Your account has been created successfully!"
				});

				// User doesn't exist, create a new one and set interview counts to 0
				GlobalApi.postNewUXDesigner({
					data: {
						userName: user?.family_name,
						email: user?.email
					}
				})
					.then((res) => {
						if (res.status === 200) {
							setUxDesigner(res.data.data);
							const tourCompleted = localStorage.getItem("tourCompleted");
							if (tourCompleted !== "true") {
								setTimeout(() => {
									setShowTour(true); // Show the tour after 5 seconds
								}, 800);
							}
						}
					})
					.catch((error) => {
						toast({
							variant: "destructive",
							title: "Registration Error",
							description: `Failed to register user: ${error.message}`
						});
					});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error!",
				description: "An error occurred while fetching user details."
			});
			console.error("Error fetching user details:", error);
		} finally {
			setIsLoading(false); // End loading
		}
	};

	// Fetch the user data once the email is known
	useEffect(() => {
		if (user?.email) {
			fetchUserDetails();
		}
	}, [user?.email]);

	const handleTourCallback = (data) => {
		if (data.status === "finished" || data.status === "skipped") {
			setShowTour(false); // End the tour
		}
	};

	return (
		<section className="good-job">
			<Breadcrumb className="my-3">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">AIX Portal</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/" className="font-normal">
							Dashboard
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<TitleSection
				title={`Welcome back ${uxDesigner?.attributes?.userName || ""}!`}
				text="Get Started with Your Analysis 😀"
				className="welcome-message" // Ensure this class is present
			/>
			<hr className="my-12 w-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />

			{/* Boxes top for notification */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Show skeletons when data is loading */}
				{isLoading ? (
					[1, 2, 3].map((item) => (
						<Skeleton key={item} className="h-[125px] w-full rounded-xl" />
					))
				) : (
					<>
						<BoxNotification data={completedCount} status="Completed" />
						<BoxNotification data={inProgressCount} status="In-Progress" />
						<BoxNotification data={underReviewCount} status="Under Review" />
					</>
				)}
			</div>
			<hr className="my-12 w-full h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />

			<div className="grid sm:grid md:grid-cols-1 lg:grid-cols-2 gap-6 md:justify-items-center md:mt-24">
				<BoxOption
					title="Paste your text directly in the box"
					description="(Maximum 4,500 words.)"
					badge="easy way"
					link="/dashboard/paste-text"
					className="options"
				/>
				<BoxOption
					title="Upload your audio file or use drag & drop"
					description="(.mp3 or .wav files only. Maximum 10MB.)"
					badge="transcript"
					link="/dashboard/upload-audio"
					className="options"
				/>
			</div>

			{/* Display the WelcomeModal component */}
			{showTour && (
				<WelcomeModal run={showTour} handleTourCallback={handleTourCallback} />
			)}
		</section>
	);
};

export default DashboardPage;
