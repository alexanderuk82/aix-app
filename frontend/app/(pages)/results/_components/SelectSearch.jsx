import React, { useState } from "react";

const SelectSearch = ({
	options,
	placeholder = "Select an option...",
	onChange,
	value,
	error
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Find the label for the initial value
	const selectedLabel = options.find((option) => option.value === value)?.label;

	const handleSelect = (option) => {
		onChange(option.value);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 border ${
					error ? "border-red-500 bg-red-100" : "bg-white border-gray-300"
				} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800`}
			>
				<span>{selectedLabel || placeholder}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
			{isOpen && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
					<input
						className="block w-full px-3 py-2 leading-tight text-gray-700 bg-white border-b border-gray-300 focus:outline-none focus:border-slate-800"
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{filteredOptions.map((option, index) => (
						<div
							key={index}
							onClick={() => handleSelect(option)}
							className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
						>
							{option.label}
						</div>
					))}
					{filteredOptions.length === 0 && (
						<div className="px-4 py-2 text-sm text-gray-700">
							No options found ☹️
						</div>
					)}
				</div>
			)}
			{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
		</div>
	);
};

export default SelectSearch;
