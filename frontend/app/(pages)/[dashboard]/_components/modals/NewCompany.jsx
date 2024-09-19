import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import Form from "./Form";

import { FaRegBuilding } from "react-icons/fa";

const NewCompany = ({ closeDialog }) => {
	return (
		<Card>
			<CardHeader className="flex flex-col items-center">
				<CardTitle className="flex gap-2 items-center text-center flex-col md:flex-row">
					<FaRegBuilding width={32} height={32} />
					<h4 className="text-2xl">Register New Company</h4>
				</CardTitle>
				<CardDescription className="dark:text-white">
					{" "}
					Begin entering your details below.
				</CardDescription>
			</CardHeader>
			<CardContent className="w-full">
				<Form closeDialog={closeDialog} />
			</CardContent>

			<CardFooter className="border-t-[1px] border-slate-300 dark:border-slate-100/90">
				<p className="text-sm font-normal pt-4">
					Information collected will be used to store and manage interview data
					efficiently.
				</p>
			</CardFooter>
		</Card>
	);
};

export default NewCompany;
