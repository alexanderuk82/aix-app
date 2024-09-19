import React, { useState } from "react";
import ContentBox from "./ContentBox";
import { filterInterviews } from "@/lib/utils";

const BoxInfo = ({ interviews, selectedBoxId, setSelectedBoxId }) => {
	const { interviewsToday, interviewsLast7Days, interviewsLast30Days } =
		filterInterviews(interviews);
	const [selectedIndex, setSelectedIndex] = useState(null);

	return (
		<div className="flex flex-col gap-4 ">
			{interviewsToday.length > 0 && (
				<>
					<h2 className="font-medium">New</h2>
					{interviewsToday.map((interview, index) => (
						<ContentBox
							key={index}
							interview={interview}
							index={index}
							isToday={true}
							selectedBoxId={selectedBoxId}
							setSelectedBoxId={setSelectedBoxId}
						/>
					))}
				</>
			)}

			<h2 className="font-medium">Last 7 Days</h2>
			{interviewsLast7Days.map((interview, index) => (
				<ContentBox
					key={index}
					interview={interview}
					index={index}
					isToday={false}
					selectedBoxId={selectedBoxId}
					setSelectedBoxId={setSelectedBoxId}
				/>
			))}

			<h2 className="font-medium">Last 30 Days</h2>
			{interviewsLast30Days.map((interview, index) => (
				<ContentBox
					key={index}
					interview={interview}
					index={index}
					isToday={false}
					selectedBoxId={selectedBoxId}
					setSelectedBoxId={setSelectedBoxId}
				/>
			))}
		</div>
	);
};

export default BoxInfo;
