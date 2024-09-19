import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "./_components/navbar/NavBar";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AppProvider } from "@/lib/AppContext";
import Footer from "./_components/footer/Footer";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"]
});

export const metadata = {
	title: "AIUX",
	description: "This is a app for UX research and designers"
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<AppProvider>
				<ThemeProvider>
					<body
						className={`${poppins.className} dark:bg-slate-800 bg-slate-50  text-slate-800 dark:text-slate-50 good-job`}
					>
						<NavBar />
						{children}
						<Toaster />
						<Footer />
					</body>
				</ThemeProvider>
			</AppProvider>
		</html>
	);
}
