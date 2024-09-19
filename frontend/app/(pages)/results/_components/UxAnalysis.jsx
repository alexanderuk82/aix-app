import React from "react";
import { Button } from "@/components/ui/button";
import { FaRegSave } from "react-icons/fa";
import { IoMdSync } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";

import { LuFileSpreadsheet } from "react-icons/lu";

const UxAnalysis = ({
	loading,
	categoriesToRender,
	editingInterview,
	interviewRecovered,
	handleCloseDialog,
	dataCollected,
	fetchAndCategorizeResponse,
	recoveredText,
	setLoading,
	FormInterview
}) => {
	const renderCategory = (categoryName, items) => {
		const bgColorClass = getCategoryColor(categoryName);
		return (
			<div key={categoryName} className={`${bgColorClass} p-4 rounded-lg my-2`}>
				<h2 className="text-xl font-bold">
					{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
				</h2>
				<ul className="list-disc list-inside">
					{items.map((item, index) => (
						<li key={index} className="pl-4">
							{item}
						</li>
					))}
				</ul>
			</div>
		);
	};

	const getCategoryColor = (categoryName) => {
		const categoryColors = {
			frustration: "bg-red-100",
			needs: "bg-yellow-100",
			goals: "bg-green-100",
			recommendations: "bg-blue-100"
		};
		return categoryColors[categoryName] || "bg-white";
	};

	return (
		<div className="w-full text-slate-800">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
				{loading
					? [1, 2, 3, 4].map((item) => (
							<Skeleton key={item} className="h-[300px] w-full rounded-xl" />
					  ))
					: Object.entries(categoriesToRender).map(([category, items]) =>
							renderCategory(category, items)
					  )}
			</div>
			<hr className="my-12 w-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />
			<div className="flex flex-col md:flex-row gap-4 items-center">
				<Dialog>
					<DialogTrigger className="w-full md:w-fit">
						<Button
							size="lg"
							className="flex items-center gap-2 w-full lg:w-fit"
						>
							<FaRegSave size={24} />
							{editingInterview ? "Update Insights" : "Save Insights"}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader className="flex flex-col items-center">
							<DialogTitle className="flex gap-2 items-center text-center flex-col md:flex-row">
								<LuFileSpreadsheet size={24} />
								<h4 className="text-2xl capitalize">
									{editingInterview
										? "Update your Insights"
										: "Save your Insights"}
								</h4>
							</DialogTitle>
							<DialogDescription className="text-sm dark:text-white ">
								{editingInterview
									? "Your can update your Insights with new information or changes."
									: "Give your insights a name and tell us a bit more to help keep things organized."}
								<FormInterview
									closeDialog={handleCloseDialog}
									editingInterview={editingInterview}
									interviewRecovered={interviewRecovered}
								/>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
				<Button
					size="lg"
					variant="secondary"
					className="flex items-center gap-2 w-full lg:w-fit"
					onClick={() => {
						setLoading(true);
						if (!editingInterview) {
							fetchAndCategorizeResponse(
								dataCollected.formData.textAreaInput,
								dataCollected.filter
							);
						} else {
							fetchAndCategorizeResponse(recoveredText, "all");
						}
					}}
				>
					<IoMdSync size={24} /> Analyze Again
				</Button>
			</div>
		</div>
	);
};

export default UxAnalysis;
