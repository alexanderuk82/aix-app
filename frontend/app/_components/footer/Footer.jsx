"use client";
import Link from "next/link";
import { useTheme } from "../../../lib/ThemeContext";
import React from "react";
import Image from "next/image";
import { Github } from "lucide-react";
import { Linkedin } from "lucide-react";

const Footer = () => {
	const { theme } = useTheme();
	return (
		<footer className="p-8 bg-slate-800 dark:bg-slate-100 flex flex-col gap-2 text-center items-center">
			{theme === "dark" ? (
				<Link href="/">
					<Image src="/logo.svg" alt="logo" width={56} height={56} />
				</Link>
			) : (
				<Link href="/">
					<Image src="/logo-white.svg" alt="logo" width={56} height={56} />
				</Link>
			)}

			<p className="text-sm text-slate-50 dark:text-slate-800 flex items-center gap-2">
				Join Me on Socials
				<Link href="https://www.linkedin.com/in/alexandersstudio/">
					<Linkedin width={18} height={18} />
				</Link>
				<Link href="https://github.com/alexanderuk82">
					<Github width={18} height={18} />
				</Link>
			</p>
			<p className="text-sm text-slate-50 dark:text-slate-800 ">
				Project Designed and Developed by
				<Link
					className="text-teal-600 font-semibold"
					href="https://www.behance.net/alexanderburgos82"
				>
					{" "}
					Alexander B.
				</Link>
			</p>
		</footer>
	);
};

export default Footer;
