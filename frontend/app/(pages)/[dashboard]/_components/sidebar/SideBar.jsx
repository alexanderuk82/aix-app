import React, { useEffect, useState } from "react";
import GlobalApi from "@/lib/GlobalApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import BoxInfo from "./_components/BoxInfo";
import EmptyBox from "./_components/EmptyBox";

const SideBar = () => {
	const { user } = useKindeBrowserClient();
	const [interviews, setInterviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [selectedBoxId, setSelectedBoxId] = useState(null);

	useEffect(() => {
		const getInterviews = async () => {
			setIsLoading(true); // Start loading
			try {
				const response = await GlobalApi.getInterviews();
				const fetchedInterviews = response.data.data;

				const userInterviews = fetchedInterviews.filter(
					(interview) =>
						interview.attributes.user_name?.data?.attributes?.email ===
						user.email
				);

				setInterviews(userInterviews);
			} catch (error) {
				console.error("Failed to fetch interviews:", error);
			} finally {
				setIsLoading(false); // End loading
			}
		};

		if (user?.email) {
			getInterviews();
		}
	}, [user?.email]);

	// Assuming a fixed number of skeleton loaders for illustration
	const skeletonCount = 4;

	return (
		<div className="h-full w-full">
			<h3 className="text-xl font-semibold my-3">Saved interviews</h3>
			<div className="h-full w-full overflow-y-auto pr-1 md:pb-8">
				{isLoading ? (
					// Display multiple skeleton loaders
					Array.from({ length: skeletonCount }, (_, index) => (
						<Skeleton
							key={index}
							className="h-[300px] w-full rounded-xl mb-2"
						/>
					))
				) : interviews.length > 0 ? (
					<BoxInfo
						interviews={interviews}
						selectedBoxId={selectedBoxId}
						setSelectedBoxId={setSelectedBoxId}
					/>
				) : (
					<EmptyBox />
				)}
			</div>
		</div>
	);
};

export default SideBar;
