import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { set, useForm, Controller } from "react-hook-form";
import Input from "../../[dashboard]/_components/input/InputField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import BadgeStatus from "./BadgeStatus";
import { Check, ChevronsUpDown } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import GlobalApi from "@/lib/GlobalApi";
import SelectSearch from "./SelectSearch";
import { generateSlug } from "@/lib/utils";

import axios from "axios";

const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
	headers: {
		"Content-Type": "application/json"
	}
});

const FormInterview = ({
	closeDialog,
	editingInterview,
	interviewRecovered
}) => {
	const { toast } = useToast();
	const { user } = useKindeBrowserClient();
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedCompanyId, setSelectedCompanyId] = useState(null);
	const [textInterview, setTextInterview] = useState("");
	const [uxAnalysis, setUxAnalysis] = useState(null);
	const [uxAtomic, setUxAtomic] = useState(null);
	const [chatHistory, setChatHistory] = useState([]);
	const router = useRouter();
	const [mainId, setMainId] = useState(null);
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors }
	} = useForm();
	const [companies, setCompanies] = useState([]);

	useEffect(() => {
		async function fetchData() {
			if (!user?.email) return;

			setLoading(true);
			try {
				const userResponse = await GlobalApi.getDesigner();
				const matchedUser = userResponse.data.data.find(
					(u) => u.attributes.email === user.email
				);

				if (!matchedUser) {
					throw new Error("User not found");
				}

				setUserData(matchedUser);
				const userCompanies = matchedUser.attributes.companies.data;

				if (userCompanies.length === 0) {
					alert(
						"To continue and save your interview, you need to register a company first. Go to the top right corner and click the icon to register a company."
					);
					closeDialog();
				}

				setCompanies(
					userCompanies.map((company) => ({
						value: company.id,
						label: company.attributes.Name
					}))
				);

				const storedData = localStorage.getItem("dataCollected");
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					if (parsedData.formData && parsedData.formData.textAreaInput) {
						setTextInterview(parsedData.formData.textAreaInput);
					}
				}

				const uxAnalysisData = localStorage.getItem("uxAnalysis");
				if (uxAnalysisData) {
					setUxAnalysis(JSON.parse(uxAnalysisData));
				}

				const uxAtomicData = localStorage.getItem("uxAtomic");
				if (uxAtomicData) {
					setUxAtomic(JSON.parse(uxAtomicData));
				}

				const chatHistoryData = localStorage.getItem("chatHistory");
				if (chatHistoryData) {
					setChatHistory(JSON.parse(chatHistoryData));
				}

				if (editingInterview && interviewRecovered) {
					setMainId(interviewRecovered.id);
					setValue("insightName", interviewRecovered.attributes?.title || "");
					setValue(
						"description",
						interviewRecovered.attributes?.description || ""
					);
					setValue(
						"interviewerName",
						interviewRecovered.attributes?.Interviewed || ""
					);
					setValue("productType", interviewRecovered.attributes?.product || "");
					setSelectedCompanyId(
						interviewRecovered.attributes?.company?.data?.id || null
					);
				}
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Failed to fetch data",
					description: "Please try again later 😢"
				});
				console.error("Error fetching data:", error.message);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [user?.email, toast, editingInterview, interviewRecovered, setValue]);

	useEffect(() => {
		if (editingInterview && interviewRecovered) {
			setValue("insightName", interviewRecovered.attributes?.title || "");
			setValue("description", interviewRecovered.attributes?.description || "");
			setValue(
				"interviewerName",
				interviewRecovered.attributes?.Interviewed || ""
			);
			setValue("productType", interviewRecovered.attributes?.product || "");
			setSelectedCompanyId(
				interviewRecovered.attributes?.company?.data?.id || null
			);
		}
	}, [editingInterview, interviewRecovered, setValue]);

	const onSubmit = async (info) => {
		if (!userData) {
			toast({
				variant: "destructive",
				title: "Submission Error",
				description: "User data not loaded. Please wait."
			});
			return;
		}

		const interviewId = generateSlug(info.insightName);

		try {
			const updatedUxAnalysis = localStorage.getItem("uxAnalysis");
			const updatedUxAtomic = localStorage.getItem("uxAtomic");
			const updatedChatHistory = localStorage.getItem("chatHistory");

			if (editingInterview) {
				const interviewResponse = await axiosClient.get(
					`/interviews/${interviewRecovered?.id}`,
					{
						params: { populate: "*" }
					}
				);

				if (
					!interviewResponse ||
					!interviewResponse.data ||
					!interviewResponse.data.data
				) {
					throw new Error("Interview data is not available or malformed.");
				}

				const interview = interviewResponse.data.data;

				if (!interview || !interview.attributes) {
					throw new Error(
						"Interview attributes are not available or malformed."
					);
				}

				if (!interview.attributes.status || !interview.attributes.status.data) {
					throw new Error(
						"Interview status data is not available or malformed."
					);
				}

				const statusToUpdate = interview.attributes.status.data;

				statusToUpdate.attributes.status = info.status;

				const interviewData = {
					title: info.insightName,
					description: info.description,
					date: new Date().toISOString().split("T")[0],
					textInterview:
						info.textInterview || interview.attributes.textInterview,
					user_name: userData.id,
					product: info.productType || interview.attributes.product,
					Interviewed: info.interviewerName || interview.attributes.Interviewed,
					status: statusToUpdate.id,
					idInterview: interviewId,
					company: selectedCompanyId || interview.attributes.company?.data?.id,
					uxAnalysis: updatedUxAnalysis
						? JSON.parse(updatedUxAnalysis)
						: interview.attributes.uxAnalysis || uxAnalysis,
					uxAtomic: updatedUxAtomic
						? JSON.parse(updatedUxAtomic)
						: interview.attributes.uxAtomic || uxAtomic,
					chatHistory: updatedChatHistory
						? JSON.parse(updatedChatHistory)
						: interview.attributes.chatHistory || chatHistory
				};

				await axiosClient.put(`/statuses/${statusToUpdate.id}`, {
					data: { status: info.status }
				});

				const response = await GlobalApi.updateInterview(
					interviewRecovered?.id,
					{
						data: interviewData
					}
				);
			} else {
				const statusData = {
					data: {
						status: info.status,
						user_name: userData.id
					}
				};

				const statusResponse = await axiosClient.post("/statuses", statusData);
				const statusId = statusResponse.data.data.id;

				const interviewData = {
					data: {
						title: info.insightName,
						description: info.description,
						date: new Date().toISOString().split("T")[0],
						textInterview,
						user_name: userData.id,
						product: info.productType,
						Interviewed: info.interviewerName,
						status: statusId,
						idInterview: interviewId,
						company: selectedCompanyId,
						uxAnalysis: updatedUxAnalysis
							? JSON.parse(updatedUxAnalysis)
							: uxAnalysis,
						uxAtomic: updatedUxAtomic ? JSON.parse(updatedUxAtomic) : uxAtomic,
						chatHistory: updatedChatHistory
							? JSON.parse(updatedChatHistory)
							: []
					}
				};

				const response = await axiosClient.post("/interviews", interviewData);
			}
			localStorage.removeItem("dataCollected");
			localStorage.removeItem("userData");
			localStorage.removeItem("chatHistory");
			localStorage.removeItem("uxAnalysis");
			localStorage.removeItem("uxAtomic");

			toast({
				title: "Interview Submitted",
				description: "Your interview has been successfully saved! 🎉"
			});
			closeDialog();
			router.push(`/dashboard/`);
		} catch (error) {
			console.error("Failed to post interview:", error);
			toast({
				variant: "destructive",
				title: "Failed to Save",
				description: `Could not save interview data. Please try again. ${error.message}`
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
			<Input
				id="insightName"
				label="Insight Name"
				placeholder="Enter a name for the insight"
				register={register}
				errors={errors}
				type="text"
				defaultValue={
					editingInterview ? interviewRecovered?.attributes?.title || "" : ""
				}
			/>

			<div className="flex flex-col gap-4 mt-4">
				<p className="text-sm text-slate-800 dark:text-white font-medium">
					Select company
				</p>
				<Controller
					name="companyName"
					control={control}
					rules={{ required: "Selecting a company is required." }}
					render={({ field, fieldState }) => (
						<SelectSearch
							options={companies}
							placeholder="Select a company"
							onChange={(value) => {
								field.onChange(value);
								setSelectedCompanyId(value);
							}}
							value={selectedCompanyId}
							error={fieldState.error}
						/>
					)}
				/>
			</div>

			<Input
				id="interviewerName"
				label="Interviewer Name"
				placeholder="Enter interviewer name"
				register={register}
				errors={errors}
				type="text"
				defaultValue={
					editingInterview
						? interviewRecovered?.attributes?.Interviewed || ""
						: ""
				}
			/>

			<Controller
				name="productType"
				control={control}
				rules={{ required: "You must select a product type." }}
				render={({ field, fieldState: { error } }) => (
					<div
						className={`flex flex-col gap-4 mt-4 ${
							error
								? "border-red-500 bg-red-100 rounded-lg text-slate-400 font-normal"
								: "bg-transparent border-transparent"
						}`}
					>
						<p
							className={`text-sm text-slate-800 ${
								error ? "text-slate-400" : "dark:text-white"
							} font-medium`}
						>
							Which kind of product did you analyze?
						</p>
						<RadioGroup {...field} className="flex gap-4">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="website" id="website" />
								<Label htmlFor="website">Website</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="Mobile App" id="Mobile App" />
								<Label htmlFor="Mobile App">Mobile App</Label>
							</div>
						</RadioGroup>
						{error && (
							<p className="mt-2 text-sm text-red-500">{error.message}</p>
						)}
					</div>
				)}
			/>

			<BadgeStatus control={control} name="status" />

			<Input
				id="description"
				label="Description"
				placeholder="Enter a small description of the interview"
				register={register}
				errors={errors}
				type="text"
				defaultValue={
					editingInterview
						? interviewRecovered?.attributes?.description || ""
						: ""
				}
			/>

			<Button
				type="submit"
				disabled={loading}
				className="w-full mt-4"
				size="lg"
			>
				Save Insights
			</Button>
		</form>
	);
};

export default FormInterview;
