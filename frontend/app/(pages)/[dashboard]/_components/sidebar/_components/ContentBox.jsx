import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { formatTime, formatName } from "@/lib/utils";
import {
	Building,
	Calendar,
	Clock,
	UserCheck,
	Package,
	PencilLine,
	Share2
} from "lucide-react";
import iconDots from "../../../../../../public/menuTopDots.svg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const ContentBox = ({
	interview,
	index,
	isToday,
	selectedBoxId,
	setSelectedBoxId
}) => {
	const [boxId] = useState(uuidv4());

	const router = useRouter();

	const handleClick = () => {
		setSelectedBoxId(boxId);
	};

	const isSelected = selectedBoxId === boxId;

	const borderClass = isSelected
		? "border-yellow-500 border-4"
		: "border-neutral-200 dark:border-slate-500 border-[1px]";
	const backgroundClass = isToday
		? "bg-emerald-50 dark:bg-teal-800"
		: "bg-white dark:bg-slate-800";

	const deleteInterview = async (id) => {
		if (window.confirm("Are you sure you want to delete this interview?")) {
			try {
				const baseUrl = process.env.NEXT_PUBLIC_API_URL;

				console.log("Starting delete process");

				// Paso 1: Obtener datos de la entrevista con relaciones pobladas
				const interviewResponse = await axios.get(
					`${baseUrl}/api/interviews/${id}?populate=*`
				);
				const interviewData = interviewResponse.data.data;

				console.log("Interview Data:", interviewData);

				const userId = interviewData.attributes.user_name.data.id;
				const statusId = interviewData.attributes.status.data.id;

				// Paso 2: Obtener datos del usuario y del estado
				const userResponse = await axios.get(
					`${baseUrl}/api/user-names/${userId}?populate=*`
				);
				const userData = userResponse.data.data;

				const statusResponse = await axios.get(
					`${baseUrl}/api/statuses/${statusId}?populate=*`
				);
				const statusData = statusResponse.data.data;

				// Paso 3: Actualizar relaciones del usuario
				const updatedUserStatuses = userData.attributes.statuses.data
					.filter((status) => status.id !== statusId)
					.map((status) => status.id);

				console.log("Updated User Statuses:", updatedUserStatuses);

				await axios.put(`${baseUrl}/api/user-names/${userId}`, {
					data: {
						statuses: updatedUserStatuses
					}
				});

				// Paso 4: Eliminar relación del estado
				const updatedStatusInterviews = statusData.attributes.interviews.data
					.filter((interview) => interview.id !== id)
					.map((interview) => interview.id);

				console.log("Updated Status Interviews:", updatedStatusInterviews);

				await axios.put(`${baseUrl}/api/statuses/${statusId}`, {
					data: {
						interviews: updatedStatusInterviews
					}
				});

				// Paso 5: Eliminar el estado si no tiene entrevistas
				if (updatedStatusInterviews.length === 0) {
					await axios.delete(`${baseUrl}/api/statuses/${statusId}`);
				}

				// Paso 6: Eliminar la entrevista
				await axios.delete(`${baseUrl}/api/interviews/${id}`);

				console.log("Interview successfully deleted");

				router.push("/dashboard");
				// window.location.reload();
			} catch (error) {
				console.error(
					"Failed to delete interview:",
					error.response || error.message
				);
				alert("Failed to delete interview. Please try again.");
			}
		}
	};
	return (
		<div
			id={boxId}
			className={`${borderClass} ${backgroundClass} content-box shadow-sm flex flex-col gap-3 rounded-lg overflow-hidden min-w-[262px] max-w-96`}
			onClick={handleClick}
		>
			<div className="flex items-center justify-between bg-sky-100 text-slate-800 dark:bg-slate-50 px-3 py-1 gap-2">
				{" "}
				<div className="flex flex-col gap-2">
					<div className="flex flex-col gap-2">
						<h2 className="font-medium" title={interview.attributes.title}>
							{interview.attributes.title}
						</h2>
						<p className="w-fit inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs mb-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300 border-transparent text-slate-800 shadow hover:bg-amber-400/80 bg-amber-400">
							{interview.attributes.status.data.attributes.status}
						</p>
					</div>
				</div>
				<Popover>
					<PopoverTrigger>
						<Button
							variant="primary"
							size="icon"
							className="hover:bg-slate-300 focus:bg-slate-300 rounded-full transition"
						>
							<Image src={iconDots} alt="Dots" width={3} height={13} />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-36">
						<Link
							className="py-2 rounded px-2 hover:bg-slate-200/90 dark:hover:bg-slate-500/90 flex gap-2 capitalize"
							href={`/results?id=${interview.attributes.idInterview}`}
						>
							<PencilLine width={15} height={15} />
							update
						</Link>
						<Link
							className="py-2 rounded px-2 hover:bg-slate-200/90 dark:hover:bg-slate-500/90 flex gap-2 capitalize"
							href="#"
						>
							<Share2 width={15} height={15} />
							share
						</Link>
						<div className="border-t-[1px] border-slate-300">
							<Button
								variant="destructive"
								size="sm"
								className="mt-3 w-full capitalize"
								onClick={() => deleteInterview(interview.id)}
							>
								delete insights
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* Box link items box sidebar Box content */}
			<Link
				className="flex flex-col gap-3 p-3 text-slate-800 dark:text-white"
				href={`/results?id=${interview.attributes.idInterview}`}
				key={index}
			>
				<div className="flex gap-2 items-center">
					<Calendar size={16} />
					<p className="capitalize flex gap-3 font-medium">
						date:
						<span className="font-normal">{interview.attributes?.date}</span>
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<Clock size={16} />
					<p className="capitalize flex gap-3 font-medium">
						Time:
						<span className="font-normal">
							{formatTime(interview.attributes?.createdAt)}
						</span>
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<UserCheck size={16} />
					{interview.attributes?.Interviewed ? (
						<p className="capitalize flex gap-3 font-medium">
							Interviewed:
							<span className="font-normal">
								{formatName(interview.attributes.Interviewed)}
							</span>
						</p>
					) : (
						<p className="text-gray-500">Interviewer details not available</p>
					)}
				</div>

				<div className="flex gap-2 items-center">
					<Building size={16} />
					<p className="capitalize flex gap-3 font-medium">
						Company:
						<span className="font-normal">
							{interview.attributes?.company?.data?.attributes?.Name}
						</span>
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<Package size={16} />
					<p className="capitalize flex gap-3 font-medium">
						Product
						<span className="font-normal">{interview.attributes?.product}</span>
					</p>
				</div>
			</Link>
		</div>
	);
};

export default ContentBox;
