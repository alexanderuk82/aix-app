"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const PasteText = ({ transcription }) => {
	const options = [
		{ value: "all", label: "All" },
		{ value: "frustration", label: "Frustration" },
		{ value: "needs", label: "Needs" },
		{ value: "recommendations", label: "Recommendations" },
		{ value: "goals", label: "Goals" }
	];

	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	const [open, setOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(options[0]);

	useEffect(() => {
		if (transcription) {
			localStorage.removeItem("transcription");
		}
	}, [transcription]);

	const onSubmit = (data) => {
		const dataCollected = {
			formData: data,
			filter: selectedOption.value
		};

		console.log(dataCollected);

		localStorage.setItem("dataCollected", JSON.stringify(dataCollected));

		router.push("/results");
	};

	const handleSelectOption = (value) => {
		const option = options.find((o) => o.value === value);
		setSelectedOption(option);
		setOpen(false);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full ">
			<textarea
				{...register("textAreaInput", { required: true, maxLength: 9500 })}
				rows="14"
				placeholder="Paste your text here (up to 4,500 words)"
				className="w-full p-2 border border-gray-300 rounded shadow-sm focus:border-teal-600 focus:ring focus:ring-teal-700 focus:ring-opacity-50 dark:text-slate-800 form-paste"
				defaultValue={transcription || ""}
			/>
			{errors.textAreaInput && (
				<p className="text-red-500 text-xs ">
					The content is required. or too long ☹️
				</p>
			)}

			<div className="flex justify-between flex-col-reverse gap-4 md:gap-0 md:flex-row justify-start md:items-center mt-4">
				<Button type="submit" size="lg">
					Analyze content
				</Button>

				<div className="flex flex-col gap-1 md:gap-2 md:flex-row justify-center md:items-center">
					<p className="text-primary">Filtered by: </p>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="lg"
								className="justify-center text-left flex gap-1 items-center justify-center"
							>
								Analyze
								<span
									className={`${
										selectedOption ? "text-teal-600 underline" : ""
									}`}
								>
									{selectedOption?.label}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="p-0 md:align-start"
							side={window.innerWidth < 768 ? "center" : "left"}
							align={window.innerWidth < 768 ? "center" : "start"}
						>
							<Command>
								<CommandInput placeholder="Filter options..." />
								<CommandList>
									{options.length > 0 ? (
										<CommandGroup>
											{options.map((option) => (
												<CommandItem
													key={option.value}
													value={option.value}
													onSelect={() => handleSelectOption(option.value)}
												>
													<span>{option.label}</span>
												</CommandItem>
											))}
										</CommandGroup>
									) : (
										<CommandEmpty>No results found.</CommandEmpty>
									)}
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</form>
	);
};

export default PasteText;
