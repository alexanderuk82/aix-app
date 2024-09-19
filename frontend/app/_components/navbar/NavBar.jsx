"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Switch from "@/lib/Switch";
import { useTheme } from "../../../lib/ThemeContext";
import { ChevronRight } from "lucide-react";
import { CirclePlus } from "lucide-react";
import ButtonResponsive from "@/lib/ButtonResponsive";
import { Contact } from "lucide-react";
import { MessagesSquare } from "lucide-react";
import { CircleUser } from "lucide-react";
import { Building } from "lucide-react";
import { MessageSquareText } from "lucide-react";
import { Search } from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import GlobalApi from "@/lib/GlobalApi";
import NewCompany from "../../(pages)/[dashboard]/_components/modals/NewCompany";

import {
	RegisterLink,
	LoginLink,
	LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from "@/components/ui/command";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";

const NavBar = () => {
	const { user } = useKindeBrowserClient();

	const btnSize = ButtonResponsive();
	const { theme } = useTheme();

	// Modal foR inserting new company
	const [openModal, setOpenModal] = useState(false);

	const handleModalClose = () => {
		setOpenModal(false);
	};

	// Modal for searching interviews
	const [open, setOpen] = useState(false);
	const toggleModal = () => {
		setOpen((open) => !open);
	};

	// Getting interviews from the API and filtering them by user email address and Loading Skeletons
	const [interviews, setInterviews] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const [searchTerm, setSearchTerm] = useState("");

	const [filteredResults, setFilteredResults] = useState([]);

	useEffect(() => {
		const getInterviews = async () => {
			setIsLoading(true); // Start loading
			try {
				const response = await GlobalApi.getInterviews();
				console.log(response.data);
				const fetchedInterviews = response.data.data;

				const userInterviews = fetchedInterviews.filter(
					(interview) =>
						interview.attributes.user_name?.data?.attributes?.email ===
						user.email
				);

				setInterviews(userInterviews);
				// Initially show all interviews
				setFilteredResults(userInterviews);
				console.log(userInterviews);
			} catch (error) {
				console.error("Failed to fetch interviews:", error);
			} finally {
				setIsLoading(false); // End loading
			}
		};

		if (user?.email) {
			getInterviews();
		}
	}, [user?.email]);

	// Implementing the search functionality
	useEffect(() => {
		const results = interviews.filter(
			(interview) =>
				interview.attributes?.company?.data?.attributes?.Name.toLowerCase().includes(
					searchTerm.toLowerCase()
				) ||
				interview.attributes.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				interview.attributes.Interviewed.toLowerCase().includes(
					searchTerm.toLowerCase()
				)
		);

		setFilteredResults(results);
	}, [searchTerm, interviews]);

	// Control the modal with keyboard shortcuts

	useEffect(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggleModal();
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<nav className="container mx-0 max-w-[1900px]  flex justify-between items-center shadow-sm lg:shadow-md sticky top-0 bg-slate-50 dark:bg-slate-800 gap-2 z-[3000]">
			{theme === "dark" ? (
				<Link href="/dashboard">
					<Image src="/logo-white.svg" alt="logo" width={80} height={80} />
				</Link>
			) : (
				<Link href="/dashboard">
					<Image src="/logo.svg" alt="logo" width={80} height={80} />
				</Link>
			)}

			{/* Search input for interviews */}

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Start typing to search interviews..."
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
					}}
				/>
				<CommandList className="px-5 md:px-0">
					{filteredResults.length > 0 ? (
						filteredResults.map((interview, index) => (
							<CommandGroup key={index} heading="Interview">
								<Link
									href={`/results?id=${interview.attributes.idInterview}`}
									key={index}
									onClick={() => setOpen(false)}
								>
									<CommandItem>
										<FileSpreadsheet className="mr-2 h-4 w-4" />
										<span>{interview.attributes.title}</span>
									</CommandItem>
								</Link>
							</CommandGroup>
						))
					) : (
						<CommandEmpty>No interviews or companies found ☹️</CommandEmpty>
					)}
				</CommandList>
			</CommandDialog>

			{user && (
				<Button variant="outline" size={btnSize} onClick={toggleModal}>
					<span className="hidden md:flex gap-4 items-center">
						Search interviews or companies...
						<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 py-3 bg-slate-300 dark:text-slate-800 font-mono text-[10px] font-medium opacity-100 sm:flex">
							<span className="text-xs">⌘</span>K
						</kbd>
					</span>
					<Search width={15} height={15} className="md:hidden" />
				</Button>
			)}

			<aside className="flex justify-between items-center gap-2">
				{/* Switch theme light or dark */}
				<Switch />

				{!user && (
					<LoginLink>
						<Button variant="outline" size={btnSize}>
							Log in
							<ChevronRight width={15} height={15} />
						</Button>
					</LoginLink>
				)}
				{/* Add New interviews or new company */}
				{user ? (
					<Popover>
						<PopoverTrigger>
							<Button size={btnSize} className="nav-add">
								Add
								<CirclePlus width={15} height={15} className="ml-2" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[95%]">
							<div className="flex flex-col gap-2 justify-center items-start ">
								<Dialog open={openModal} onOpenChange={setOpenModal}>
									<DialogTrigger asChild>
										<span className="py-2 rounded px-2 hover:bg-slate-200/90 dark:hover:bg-slate-500/90 flex gap-2 items-center text-nowrap">
											<Building width={15} height={15} />
											New Company
										</span>
									</DialogTrigger>
									<DialogContent>
										<NewCompany closeDialog={handleModalClose} />
									</DialogContent>
								</Dialog>

								<Link
									className="py-2 rounded px-2 hover:bg-slate-200/90 dark:hover:bg-slate-500/90 flex gap-2 items-center text-nowrap"
									href="/dashboard/"
								>
									<MessageSquareText width={15} height={15} />
									New Interview
								</Link>
							</div>
						</PopoverContent>
					</Popover>
				) : (
					<RegisterLink>
						<Button size={btnSize}>
							Register
							<ChevronRight width={15} height={15} />
						</Button>
					</RegisterLink>
				)}
				{/* Picture profile user */}
				{user && (
					<Popover>
						<PopoverTrigger className="border border-teal-500 dark:border-teal-200  bg-white rounded-full">
							{user.picture ? (
								<Image
									src={user.picture}
									alt="user"
									width={40}
									height={40}
									className="rounded-full"
								/>
							) : (
								<CircleUser
									width={40}
									height={40}
									className="dark:text-slate-500"
								/> // Adjust the size as needed
							)}
						</PopoverTrigger>
						<PopoverContent>
							<div className="flex flex-col gap-2">
								<Link
									className="py-2 rounded px-2 hover:bg-slate-200/90 dark:hover:bg-slate-500/90  flex gap-2"
									href="/dashboard/profile"
								>
									<Contact width={15} height={15} />
									Profile
								</Link>
								<Link
									className="py-2 rounded px-2 hover:bg-slate-200/90 dark:hover:bg-slate-500/90 flex gap-2"
									href="/dashboard/interviews"
								>
									<MessagesSquare width={15} height={15} />
									Interviews
								</Link>
								<div className="border-t-[1px] border-slate-300">
									<LogoutLink>
										<Button
											variant="default"
											size={btnSize}
											className="mt-3 w-full"
										>
											Log out
										</Button>
									</LogoutLink>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				)}
			</aside>
		</nav>
	);
};

export default NavBar;
