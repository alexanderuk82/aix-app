import React from "react";
import { Controller } from "react-hook-form";

const BadgeStatus = ({ control, name }) => {
	const statusOptions = [
		{ label: "completed", value: "completed" },
		{ label: "under-review", value: "under-review" },
		{ label: "in-progress", value: "in-progress" }
	];

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value } }) => (
				<div className="flex flex-col gap-4 mt-4">
					<p className="text-sm text-slate-800 dark:text-white font-medium">
						Status of the interview
					</p>
					<div className="flex gap-4">
						{statusOptions.map((statusItem) => (
							<button
								key={statusItem.value}
								type="button"
								onClick={() => onChange(statusItem.label)} // Aquí se pasa el label del estado directamente
								className={`bg-${
									statusItem.label === "completed"
										? "green"
										: statusItem.label === "under-review"
										? "yellow"
										: statusItem.label === "in-progress"
										? "blue"
										: "gray"
								}-100 dark:bg-${
									statusItem.label === "completed"
										? "green"
										: statusItem.label === "under-review"
										? "yellow"
										: statusItem.label === "in-progress"
										? "blue"
										: "gray"
								}-300 text-slate-800 rounded-full px-2 py-1 font-medium ${
									value === statusItem.label
										? "ring-2 ring-offset-2 ring-slate-800 dark:ring-slate-100 dark:outline"
										: ""
								}`}
							>
								{statusItem.label}
							</button>
						))}
					</div>
				</div>
			)}
		/>
	);
};

export default BadgeStatus;
