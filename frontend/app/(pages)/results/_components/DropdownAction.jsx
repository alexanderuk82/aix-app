// components/DropdownActions.js
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Printer, Share2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import generatePDF from "@/lib/generatePDF";

const DropdownActions = ({ open, setOpen, analysisData, atomicData }) => (
	<DropdownMenu open={open} onOpenChange={setOpen}>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost" size="sm">
				<MoreHorizontal />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" className="w-[200px]">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuGroup>
				<DropdownMenuItem onClick={() => generatePDF(analysisData, atomicData)}>
					<Download className="mr-2 h-4 w-4" />
					Download insights
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Printer className="mr-2 h-4 w-4" />
					Print insights
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Share2 className="mr-2 h-4 w-4" />
					Share via email
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
);

export default DropdownActions;
