import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const BoxOption = ({ title, description, link, badge }) => {
	return (
		<>
			<Link
				href={link}
				className="col-span-auto bg-sky-50 hover:bg-sky-200 dark:bg-teal-100  dark:hover:bg-teal-600 border border-slate-300 shadow-sm  flex  flex-col items-center justify-center py-12 md:py-24 px-6 rounded-lg text-slate-800 dark:hover:text-white md:w-[70%] transition duration-300 ease-in-out options"
			>
				<Badge className="mb-5 bg-amber-400">{badge}</Badge>
				<div className="text-center  flex flex-col gap-5">
					<h3 className="card-title text-2xl md:text-3xl font-medium">
						{title}
					</h3>
					<p className="font-normal">{description}</p>
				</div>
			</Link>
		</>
	);
};

export default BoxOption;
