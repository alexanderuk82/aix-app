import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const BoxNotification = ({ data, status }) => {
	// A helper function to determine the description based on the status
	const getStatusDescription = (status) => {
		switch (status) {
			case "Completed":
				return "All tasks done and fully documented.";
			case "In-Progress":
				return "Currently active; work is underway.";
			case "Under Review":
				return "Awaiting final evaluation and sign-off.";
			default:
				return "";
		}
	};

	// A helper function to determine the background color based on the status
	const getStatusBgColor = (status) => {
		switch (status) {
			case "Completed":
				return "bg-green-100"; // Light green background
			case "In-Progress":
				return "bg-yellow-100"; // Light yellow background
			case "Under Review":
				return "bg-orange-100"; // Light blue background
			default:
				return "bg-gray-100"; // Default background color
		}
	};

	return (
		<Link
			href={`/status/${status}`}
			className={`cursor-pointer rounded-lg ${getStatusBgColor(
				status
			)} shadow dark:text-surface shadow-secondary-1 dark:bg-surface-dark text-slate-800 py-6 md:py-8 px-4 gap-4 flex justify-between items-center`}
		>
			<div>
				<h5 className="text-xl md:text-2xl font-medium leading-tight">
					{status}
				</h5>
				<p className="text-sm text-slate-800 font-normal">
					{getStatusDescription(status)}
				</p>
			</div>
			<h2 className="text-4xl">{data}</h2>
		</Link>
	);
};

export default BoxNotification;
