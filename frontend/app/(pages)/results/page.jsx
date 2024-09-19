"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/lib/GlobalApi";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import TitleSection from "../[dashboard]/_components/titleSection/TitleSection";
import ChatDrawer from "./_components/ChatDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormInterview from "./_components/FormInterview";
import UxAnalysis from "./_components/UxAnalysis";
import UxAtomic from "./_components/UxAtomic";
import DropdownActions from "./_components/DropdownAction";
import BreadcrumbNavigation from "./_components/BreadcrumbNavigation";
import { set } from "react-hook-form";

const ResultsPage = () => {
	const [open, setOpen] = useState(false);
	const [dataCollected, setDataCollected] = useState(null);
	const [categorizedResponse, setCategorizedResponse] = useState({});
	const [atomicResponse, setAtomicResponse] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [closeDialog, setCloseDialog] = useState(false);
	const [editingInterview, setEditingInterview] = useState(null);
	const [recoveredText, setRecoveredText] = useState("");
	const [titleInterview, setTitleInterview] = useState("");
	const [descriptionText, setDescriptionText] = useState("");
	const [statusInterview, setStatusInterview] = useState("");
	const [interviewRecovered, setInterviewRecovered] = useState([]);
	const [mainId, setMainId] = useState(null);
	const router = useRouter();

	const getStatusBgColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-100"; // Light green background
			case "in-progress":
				return "bg-yellow-100"; // Light yellow background
			case "under-review":
				return "bg-orange-100"; // Light blue background
			default:
				return "bg-gray-100"; // Default background color
		}
	};

	const searchParams = useSearchParams();
	const idInterview = searchParams.get("id");
	const toast = useToast();

	const handleCloseDialog = () => {
		setOpen(false);
		router.push("/dashboard"); // Redirige al dashboard
	};

	const fetchAndCategorizeResponse = async (textAreaInput, filter) => {
		try {
			const [analysisResponse, atomicResponse] = await Promise.all([
				GlobalApi.fetchOpenAiResponse(textAreaInput),
				GlobalApi.fetchOpenAiAtomicResponse(textAreaInput)
			]);

			const categories =
				filter === "all"
					? analysisResponse
					: { [filter]: analysisResponse[filter] };

			setCategorizedResponse(categories);
			setAtomicResponse(atomicResponse);
			localStorage.setItem("uxAnalysis", JSON.stringify(categories));
			localStorage.setItem("uxAtomic", JSON.stringify(atomicResponse));
		} catch (err) {
			setError(err.message);
			toast({
				variant: "destructive",
				title: "Error fetching data ☹️",
				description: `Failed to fetch data from OpenAI: ${err.message}`
			});
			console.error("Failed to fetch data from OpenAI:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchInterview = async () => {
			if (idInterview) {
				try {
					const response = await GlobalApi.getInterviews();
					const interview = response.data.data.find(
						(interview) => interview.attributes.idInterview === idInterview
					);
					setInterviewRecovered(interview);
					if (interview) {
						setEditingInterview(interview);
						setCategorizedResponse(interview.attributes.uxAnalysis);
						setAtomicResponse(interview.attributes.uxAtomic);
						setRecoveredText(interview.attributes.textInterview);
						setTitleInterview(interview.attributes.title);
						setMainId(interview.id);
						setStatusInterview(
							interview.attributes.status.data.attributes.status
						);
						setDescriptionText(interview.attributes.description);
						setLoading(false); // Ensure loading is set to false
					} else {
						setError("Interview not found");
						setLoading(false);
					}
				} catch (error) {
					console.error("Failed to fetch interview:", error);
					setError("Failed to fetch interview");
					setLoading(false);
				}
			} else {
				const storedData = localStorage.getItem("dataCollected");
				if (storedData) {
					const data = JSON.parse(storedData);
					setDataCollected(data);
					fetchAndCategorizeResponse(data.formData.textAreaInput, data.filter);
				} else {
					setLoading(false);
				}
			}
		};

		fetchInterview();
	}, [idInterview]);

	if (error) return <p>Error: {error}</p>;
	if (!dataCollected && !idInterview)
		return <p>No data found. Please submit your analysis again.</p>;

	const categoriesToRender =
		dataCollected &&
		(dataCollected.filter === "all" ||
			!categorizedResponse[dataCollected.filter])
			? categorizedResponse
			: dataCollected
			? { [dataCollected.filter]: categorizedResponse[dataCollected.filter] }
			: categorizedResponse || {};

	const atomicCategoriesToRender = atomicResponse;

	const breadcrumbLinks = [
		{ href: "/", text: "AIX Portal" },
		{ href: "/dashboard", text: "Dashboard", className: "font-normal" },
		{
			href: "dashboard/paste-text",
			text: "Paste-text",
			className: "font-normal"
		}
	];

	return (
		<>
			<section>
				<BreadcrumbNavigation links={breadcrumbLinks} current="Result Page" />
				<div className="flex justify-between ">
					<div className="flex flex-col items-start justify-start gap-3">
						{idInterview ? (
							<>
								<TitleSection title={titleInterview} text={descriptionText} />
								<p
									className={`rounded-full text-sm px-2 py-1 ${getStatusBgColor(
										statusInterview
									)} text-slate-800`}
								>
									{statusInterview}
								</p>
							</>
						) : (
							<TitleSection
								title={`Your Insights Overview`}
								text="Get Started with Your Analysis 😀"
							/>
						)}
					</div>
					<DropdownActions
						open={open}
						setOpen={setOpen}
						analysisData={categoriesToRender}
						atomicData={atomicCategoriesToRender}
					/>
				</div>
				<hr className="my-12 w-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" />
			</section>

			<div className="w-full">
				<div className="container mx-auto flex flex-col space-y-2 mb-3">
					<h2 className="text-3xl text-center">Your Analysis Outcomes</h2>
					<p className="text-center font-normal">
						Explore the outcomes of your interview analysis.
					</p>
				</div>

				<Tabs defaultValue="uxAnalysis" className="w-full">
					<TabsList className="grid grid-cols-2 gap-4 items-center justify-center bg-sky-50 dark:bg-slate-100 ">
						<TabsTrigger value="uxAnalysis">UX Insights</TabsTrigger>
						<TabsTrigger value="atomic">Atomic UX</TabsTrigger>
					</TabsList>
					<TabsContent value="uxAnalysis" className="mt-4">
						<UxAnalysis
							loading={loading}
							categoriesToRender={categoriesToRender}
							editingInterview={editingInterview}
							interviewRecovered={interviewRecovered}
							handleCloseDialog={handleCloseDialog}
							dataCollected={dataCollected}
							fetchAndCategorizeResponse={fetchAndCategorizeResponse}
							recoveredText={recoveredText}
							setLoading={setLoading}
							FormInterview={FormInterview}
						/>
					</TabsContent>
					<TabsContent value="atomic">
						<UxAtomic
							loading={loading}
							categoriesToRender={atomicCategoriesToRender}
							editingInterview={editingInterview}
							interviewRecovered={interviewRecovered}
							handleCloseDialog={handleCloseDialog}
							dataCollected={dataCollected}
							fetchAndCategorizeResponse={fetchAndCategorizeResponse}
							recoveredText={recoveredText}
							setLoading={setLoading}
							FormInterview={FormInterview}
						/>
					</TabsContent>
				</Tabs>
			</div>

			<ChatDrawer
				recoveredText={recoveredText}
				idInterview={mainId}
				reset={mainId} // Use idInterview as key to force re-render on change
			/>
		</>
	);
};

export default ResultsPage;
