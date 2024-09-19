"use client";
import React from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable";
import { useIsMobile } from "../../../lib/IsMobile";
import SideBar from "./_components/sidebar/SideBar";

const LayoutDashboard = ({ children }) => {
	const mobile = useIsMobile();
	if (mobile === undefined) return null;

	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="h-screen w-full welcome-message"
		>
			<ResizablePanel
				defaultSize={mobile ? 0 : 24}
				className="border-r-[1px] dark:border-slate-600"
			>
				<div className="flex h-screen items-start justify-start p-6 pb-20 md:pb-11 dark:bg-slate-600 bg-sky-50">
					<SideBar />
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={75}>
				<div className="flex h-screen overflow-y-auto items-start justify-start p-6">
					<div className="font-semibold w-full">{children}</div>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default LayoutDashboard;
