"use client";
import React, { useState, useEffect } from "react";
import BreadcrumbNavigation from "../../results/_components/BreadcrumbNavigation";
import TitleSection from "../../[dashboard]/_components/titleSection/TitleSection";
import DropdownActions from "../../results/_components/DropdownAction";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import GlobalApi from "@/lib/GlobalApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Badge } from "@/components/ui/badge";
import ContentBox from "../../[dashboard]/_components/sidebar/_components/ContentBox";
import { set } from "react-hook-form";
import LottiePlayer from "@/components/ui/LottiePlayer";

// const PageStatus = ({ params }) => {
// 	const { user } = useKindeBrowserClient();
// 	const { toast } = useToast();
// 	const formattedStatus = decodeURIComponent(params.status).toLowerCase();
// 	const [open, setOpen] = useState(false);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [completedCount, setCompletedCount] = useState(0);
// 	const [inProgressCount, setInProgressCount] = useState(0);
// 	const [underReviewCount, setUnderReviewCount] = useState(0);
// 	const [filteredInterviews, setFilteredInterviews] = useState([]);
// 	const [userId, setUserId] = useState(null);
// 	console.log("User ID:", userId); // Debug

// 	const breadcrumbLinks = [
// 		{ href: "/dashboard", text: "AIX Portal" },
// 		{ href: "/dashboard", text: "Dashboard", className: "font-normal" },
// 		{ text: "Status", className: "font-normal" }
// 	];

// 	const statusMap = {
// 		completed: "completed",
// 		"under review": "under-review",
// 		"In progress": "in-progress"
// 	};

// 	const fetchUserDetails = async () => {
// 		setIsLoading(true); // Start loading
// 		console.log("Fetching user details..."); // Debug

// 		try {
// 			const response = await GlobalApi.getUserByEmail(user?.email);
// 			console.log("User data response:", response); // Debug
// 			const userData = response.data.data[0] || null;
// 			setUserId(userData.id);

// 			if (userData) {
// 				console.log("User data:", userData); // Debug

// 				// Initialize counters
// 				let completed = 0;
// 				let inProgress = 0;
// 				let underReview = 0;

// 				// Count interviews by status
// 				userData.attributes?.statuses?.data.forEach((statusItem) => {
// 					console.log("Status item:", statusItem); // Debug
// 					switch (statusItem.attributes.status) {
// 						case "completed":
// 							completed++;
// 							break;
// 						case "in-progress":
// 							inProgress++;
// 							break;
// 						case "under-review":
// 							underReview++;
// 							break;
// 						default:
// 							// Handle any other case if needed
// 							break;
// 					}
// 				});

// 				// Set counts
// 				setCompletedCount(completed);
// 				setInProgressCount(inProgress);
// 				setUnderReviewCount(underReview);
// 				console.log(
// 					"Counts - Completed:",
// 					completed,
// 					"In Progress:",
// 					inProgress,
// 					"Under Review:",
// 					underReview
// 				); // Debug
// 			}
// 		} catch (error) {
// 			toast({
// 				variant: "destructive",
// 				title: "Error!",
// 				description: "An error occurred while fetching user details."
// 			});
// 			console.error("Error fetching user details:", error);
// 		} finally {
// 			setIsLoading(false); // End loading
// 			console.log("Finished fetching user details."); // Debug
// 		}
// 	};

// 	const fetchInterviews = async () => {
// 		console.log("Fetching all interviews..."); // Debug
// 		try {
// 			const response = await GlobalApi.getInterviews();
// 			console.log("Interviews data response:", response); // Debug
// 			const interviewsData = response.data.data || [];

// 			// Filter interviews by user ID
// 			const userInterviews = interviewsData.filter(
// 				(interview) => interview.attributes?.user_name?.data?.id === userId
// 			);

// 			// Filter interviews by status
// 			const filteredByStatus = userInterviews.filter(
// 				(interview) =>
// 					interview.attributes?.status?.data?.attributes?.status ===
// 					statusMap[formattedStatus]
// 			);

// 			console.log("Filtered interviews by status:", filteredByStatus); // Debug
// 			setFilteredInterviews(filteredByStatus);
// 		} catch (error) {
// 			console.error("Error fetching interviews:", error);
// 		}
// 	};

// 	// Fetch user details and interviews when the component mounts
// 	useEffect(() => {
// 		if (user?.email) {
// 			fetchUserDetails();
// 		}
// 	}, [user?.email]);

// 	useEffect(() => {
// 		if (userId) {
// 			fetchInterviews();
// 		}
// 	}, [userId]);

// 	// Map formatted status to database status value
// 	const dbStatus = statusMap[formattedStatus] || formattedStatus;
// 	console.log("Mapped Status:", dbStatus); // Debug

// 	// Determine the count to display based on the dbStatus
// 	let statusCount;
// 	switch (dbStatus) {
// 		case "completed":
// 			statusCount = completedCount;
// 			break;
// 		case "in-progress":
// 			statusCount = inProgressCount;
// 			break;
// 		case "under-review":
// 			statusCount = underReviewCount;
// 			break;
// 		default:
// 			statusCount = 0;
// 			break;
// 	}

// 	console.log("Final Status:", dbStatus, "Status Count:", statusCount); // Debug

// 	return (
// 		<>
// 			<section>
// 				<BreadcrumbNavigation
// 					links={breadcrumbLinks}
// 					current={formattedStatus}
// 				/>
// 				<div className="flex justify-between">
// 					<div className="flex flex-col items-start justify-start gap-3">
// 						<TitleSection
// 							title={formattedStatus}
// 							text="This page provides an overview of your interview's status. Here, you can track the progress of your interview"
// 						/>
// 						<Badge className="mb-5 bg-amber-400">
// 							We found: <span className="font-bold mx-1"> {statusCount} </span>{" "}
// 							{formattedStatus}
// 						</Badge>
// 					</div>
// 					<DropdownActions open={open} setOpen={setOpen} />
// 				</div>
// 				<hr className="my-8 w-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />
// 			</section>

// 			<main className="flex flex-col items-center justify-center gap-3 mt-24">
// 				{filteredInterviews.map((interview, index) => (
// 					<ContentBox
// 						key={interview.id}
// 						interview={interview}
// 						index={index}
// 						isToday={false} // Update this if you have logic to determine if the interview is today
// 						selectedBoxId={null} // Update this if you have state for selected box
// 						setSelectedBoxId={() => {}} // Update this with your handler function
// 					/>
// 				))}
// 			</main>
// 		</>
// 	);
// };

// export default PageStatus;
const PageStatus = ({ params }) => {
	const { user } = useKindeBrowserClient();
	const { toast } = useToast();
	const formattedStatus = decodeURIComponent(params.status).toLowerCase();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [completedCount, setCompletedCount] = useState(0);
	const [inProgressCount, setInProgressCount] = useState(0);
	const [underReviewCount, setUnderReviewCount] = useState(0);
	const [filteredInterviews, setFilteredInterviews] = useState([]);
	const [userId, setUserId] = useState(null);
	const [loading, setLoading] = useState(true);
	console.log("User ID:", userId); // Debug

	const breadcrumbLinks = [
		{ href: "/dashboard", text: "AIX Portal" },
		{ href: "/dashboard", text: "Dashboard", className: "font-normal" },
		{ text: "Status", className: "font-normal" }
	];

	const statusMap = {
		completed: "completed",
		"under review": "under-review",
		"in progress": "in-progress"
	};

	const fetchUserDetails = async () => {
		setIsLoading(true); // Start loading
		console.log("Fetching user details..."); // Debug

		try {
			const response = await GlobalApi.getUserByEmail(user?.email);
			console.log("User data response:", response); // Debug
			const userData = response.data.data[0] || null;
			setUserId(userData.id);

			if (userData) {
				console.log("User data:", userData); // Debug

				// Initialize counters
				let completed = 0;
				let inProgress = 0;
				let underReview = 0;

				// Count interviews by status
				userData.attributes?.statuses?.data.forEach((statusItem) => {
					console.log("Status item:", statusItem); // Debug
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
				console.log(
					"Counts - Completed:",
					completed,
					"In Progress:",
					inProgress,
					"Under Review:",
					underReview
				); // Debug
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
			console.log("Finished fetching user details."); // Debug
		}
	};

	const fetchInterviews = async () => {
		console.log("Fetching all interviews..."); // Debug
		try {
			const response = await GlobalApi.getInterviews();
			console.log("Interviews data response:", response); // Debug
			const interviewsData = response.data.data || [];

			// Filter interviews by user ID
			const userInterviews = interviewsData.filter(
				(interview) => interview.attributes?.user_name?.data?.id === userId
			);

			// Filter interviews by status
			const filteredByStatus = userInterviews.filter((interview) => {
				const interviewStatus =
					interview.attributes?.status?.data?.attributes?.status;
				return (
					interviewStatus === dbStatus ||
					(dbStatus === "in-progress" && interviewStatus === "in-progress")
				);
			});

			console.log("Filtered interviews by status:", filteredByStatus); // Debug
			setFilteredInterviews(filteredByStatus);
		} catch (error) {
			console.error("Error fetching interviews:", error);
		} finally {
			setLoading(false); // Set loading to false when fetch is complete
		}
	};

	// Fetch user details and interviews when the component mounts
	useEffect(() => {
		if (user?.email) {
			fetchUserDetails();
		}
	}, [user?.email]);

	useEffect(() => {
		if (userId) {
			fetchInterviews();
		}
	}, [userId]);

	// Map formatted status to database status value
	const dbStatus = statusMap[formattedStatus] || formattedStatus;
	console.log("Mapped Status:", dbStatus); // Debug

	// Determine the count to display based on the dbStatus
	let statusCount;
	switch (dbStatus) {
		case "completed":
			statusCount = completedCount;
			break;
		case "in-progress":
			statusCount = inProgressCount;
			break;
		case "under-review":
			statusCount = underReviewCount;
			break;
		default:
			statusCount = 0;
			break;
	}

	console.log("Final Status:", dbStatus, "Status Count:", statusCount); // Debug

	return (
		<>
			<section className="p-6">
				<BreadcrumbNavigation
					links={breadcrumbLinks}
					current={formattedStatus}
				/>
				<div className="flex justify-between">
					<div className="flex flex-col items-start justify-start gap-3">
						<TitleSection
							title={formattedStatus}
							text="This page provides an overview of your interview's status. Here, you can track the progress of your interview"
						/>
						<Badge className="mb-1 bg-amber-400">
							We found: <span className="font-bold mx-1"> {statusCount} </span>{" "}
							{formattedStatus}
						</Badge>
					</div>
				</div>
			</section>

			<main className="flex h-screen dark:bg-slate-200 bg-sky-50 flex-col  mt-3">
				<div className="flex flex-col items-center md:items-start justify-start md:grid md:grid-cols-special gap-7  px-6 py-10 ">
					{loading ? ( // Check for loading state
						[1, 2, 3, 4].map((item) => (
							<Skeleton key={item} className="h-[300px] w-full rounded-xl" />
						))
					) : filteredInterviews.length === 0 ? (
						<div className="flex flex-col items-center justify-center mt-4 md:mt-6">
							<LottiePlayer
								animationName="empty2"
								width="w-50"
								height="h-50"
								speed="0.4"
							/>
							<p className="text-center text-lg font-bold text-slate-800 -mt-1">
								We couldn't find any interviews with the status you specified.
							</p>
						</div>
					) : (
						<>
							{filteredInterviews.map((interview, index) => (
								<ContentBox
									key={interview.id}
									interview={interview}
									index={index}
									isToday={false} // Update this if you have logic to determine if the interview is today
									selectedBoxId={null} // Update this if you have state for selected box
									setSelectedBoxId={() => {}} // Update this with your handler function
								/>
							))}
						</>
					)}
				</div>
			</main>
		</>
	);
};

export default PageStatus;
