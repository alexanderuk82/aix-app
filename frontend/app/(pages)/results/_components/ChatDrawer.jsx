"use client";

import React, { useState, useEffect } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlobalApi from "@/lib/GlobalApi";
import { HiSparkles } from "react-icons/hi2";
import { BiSolidUserVoice } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import LottiePlayer from "@/components/ui/LottiePlayer";
import questions from "@/lib/questions";
import { Shuffle } from "lucide-react";

import axios from "axios";
const ChatDrawer = ({ recoveredText, idInterview, reset }) => {
	const [isSending, setIsSending] = useState(false);
	const [drawerHeight, setDrawerHeight] = useState("h-40");
	const [chatHistory, setChatHistory] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [userContext, setUserContext] = useState("");
	const [interviewId, setInterviewId] = useState(idInterview); // Track interview ID
	const [uxAnalysis, setUxAnalysis] = useState(null);
	const [uxAtomic, setUxAtomic] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [randomQuestions, setRandomQuestions] = useState([]);

	const axiosClient = axios.create({
		baseURL: "http://localhost:1337/api",
		headers: {
			"Content-Type": "application/json"
		}
	});

	// Add this useEffect to handle setting the interviewId
	useEffect(() => {
		setInterviewId(idInterview);
	}, [idInterview]);

	useEffect(() => {
		if (chatHistory.length > 0) {
			setDrawerHeight(
				"mt-auto p-4 flex flex-col gap-4 h-[25rem] lg:h-[35rem] overflow-y-auto"
			);
		} else {
			setDrawerHeight("h-40"); // Reset drawer height to the original value if no chat history
		}
	}, [chatHistory]);

	useEffect(() => {
		if (idInterview && recoveredText) {
			setUserContext(recoveredText);
		} else {
			const storedData = localStorage.getItem("dataCollected");
			setUserContext(
				storedData ? JSON.parse(storedData).formData.textAreaInput : ""
			);
		}
	}, [idInterview, recoveredText]);

	// Chat history is stored in localStorage or the backend

	useEffect(() => {
		if (idInterview) {
			// Fetch chat history from backend for existing interview
			axiosClient
				.get(`/interviews/${idInterview}`, {
					params: { populate: "*" }
				})
				.then((response) => {
					const interview = response.data.data;
					if (interview && interview.attributes.chat) {
						setChatHistory(interview.attributes.chat);
					}
				})
				.catch((error) => {
					console.error("Failed to fetch chat history from backend:", error);
				});
		} else {
			// Load chat history from localStorage for new interview
			const storedChatHistory = localStorage.getItem("chat");
			if (storedChatHistory) {
				setChatHistory(JSON.parse(storedChatHistory));
			}
		}
	}, [idInterview]);

	useEffect(() => {
		const uxAnalysisData = localStorage.getItem("uxAnalysis");
		const uxAtomicData = localStorage.getItem("uxAtomic");
		if (uxAnalysisData) {
			setUxAnalysis(JSON.parse(uxAnalysisData));
		}
		if (uxAtomicData) {
			setUxAtomic(JSON.parse(uxAtomicData));
		}
	}, []);

	useEffect(() => {
		setChatHistory([]);
		setUserInput("");
		setDrawerHeight("h-40"); // Reset drawer height to the original value
	}, [reset]);

	// Button to generate random questions

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // Assuming 768px as the breakpoint for mobile
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Call it initially to set the correct state

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		generateRandomQuestions();
	}, [isMobile]); // Call the function on mount and whenever isMobile changes

	const generateRandomQuestions = () => {
		const shuffled = questions.sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, isMobile ? 3 : 6);
		setRandomQuestions(selected);
	};

	const updateChatHistory = (updatedChatHistory) => {
		setChatHistory(updatedChatHistory);

		if (interviewId) {
			axiosClient
				.put(`/interviews/${interviewId}`, {
					data: { chat: updatedChatHistory }
				})
				.catch((error) => {
					console.error("Failed to update chat history in the backend:", error);
				});
		} else {
			localStorage.setItem("chat", JSON.stringify(updatedChatHistory));
		}
	};

	const simulateTyping = (text, question) => {
		let typedText = "";
		let index = 0;
		setIsSending(true);

		const newChatEntry = { question, answer: "" };
		setChatHistory((prev) => {
			return [...prev, newChatEntry];
		});

		const interval = setInterval(() => {
			if (index < text.length) {
				typedText += text.charAt(index);
				index++;
				setChatHistory((prev) => {
					const newHistory = [...prev];
					newHistory[newHistory.length - 1].answer = typedText;
					return newHistory;
				});
			} else {
				clearInterval(interval);
				setChatHistory((prev) => {
					const updatedHistory = [...prev];
					updatedHistory[updatedHistory.length - 1].answer = typedText;
					updateChatHistory(updatedHistory); // Save the entire updated chat history
					return updatedHistory;
				});
				setIsSending(false);
			}
		}, 10);
	};

	const handleQuestionClick = async (question) => {
		if (!isSending) {
			setIsSending(true);
			setDrawerHeight(
				"mt-auto p-4 flex flex-col gap-4 h-[25rem] lg:h-[35rem] overflow-y-auto"
			);

			try {
				const response = await GlobalApi.fetchChatAiResponse(
					question,
					userContext
				);
				simulateTyping(response, question);
			} catch (error) {
				console.error("Error fetching response for question:", error);
			}
		}
	};

	const handleSend = async () => {
		if (userInput.trim() && !isSending) {
			setIsSending(true);
			setDrawerHeight(
				"mt-auto p-4 flex flex-col gap-4 h-[25rem] lg:h-[35rem] overflow-y-auto"
			);

			try {
				const response = await GlobalApi.fetchChatAiResponse(
					userInput,
					userContext
				);
				simulateTyping(response, userInput);
				setUserInput("");
			} catch (error) {
				console.error("Failed to send message:", error);
			}
		}
	};

	const formatResponse = (response) => {
		if (response.includes("\n")) {
			const listItems = response.split("\n");
			return (
				<ul>
					{listItems.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			);
		} else if (response.match(/\d+/)) {
			const formattedResponse = response.replace(
				/(\d+)/g,
				"<strong>$1</strong>"
			);
			return <p dangerouslySetInnerHTML={{ __html: formattedResponse }} />;
		}
		return <p>{response}</p>;
	};

	return (
		<div className="">
			<Drawer className="dark:bg-slate-200">
				<DrawerTrigger className="fixed -bottom-1 -right-1">
					<LottiePlayer
						animationName="chatbubble"
						width="w-24"
						height="h-24"
						speed="0.8"
					/>
				</DrawerTrigger>
				<DrawerContent className="dark:bg-slate-800">
					<DrawerHeader>
						<DrawerTitle className="mb-2">
							Have questions about your insights?
						</DrawerTitle>
						<DrawerDescription>
							<p>
								I am your AI assistant. Ask away and let’s explore deeper
								together 🤖.
							</p>

							{chatHistory.length > 0 ? (
								""
							) : (
								<div className="mt-8 w-full flex flex-col md:flex-row md:items-center md:justify-around gap-4">
									{chatHistory.length > 0 ? (
										""
									) : (
										<div className="mt-8 w-full flex flex-col md:flex-row md:justify-around gap-4">
											{randomQuestions.map((question, index) => (
												<Button
													key={index}
													onClick={() => handleQuestionClick(question)}
													size="lg"
													variant="outline"
													className="whitespace-normal h-auto py-4"
													disabled={isSending}
												>
													{question}
												</Button>
											))}
										</div>
									)}
									<span
										className="bg-amber-400 py-4 px-2 rounded-sm text-sm flex font-normal justify-center gap-2 items-center md:self-end cursor-pointer text-slate-800 text-nowrap hover:bg-teal-600 hover:text-white transition-all active:scale-95"
										onClick={() => generateRandomQuestions()}
									>
										<Shuffle />
										Generate random questions
									</span>
								</div>
							)}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter className={`${drawerHeight}`}>
						{chatHistory.length > 0 && (
							<div className="mb-32">
								{chatHistory.map((chat, index) => (
									<div key={index} className="flex flex-col gap-2 w-full">
										<p className="bg-teal-50 py-3 font-semibold flex items-center gap-2 p-2 my-2 text-slate-800 border border-gray-100 rounded-lg">
											<BiSolidUserVoice size={24} /> {chat.question}
										</p>
										<div className="bg-gray-100 p-2 my-2 text-slate-800 border border-gray-100 rounded-lg">
											<HiSparkles size={24} /> {formatResponse(chat.answer)}
										</div>
									</div>
								))}
							</div>
						)}
						<div className="flex flex-col gap-4 lg:flex-row absolute bottom-0 left-0 w-full bg-slate-50 p-4 rounded-t">
							<Textarea
								className="bg-slate-100 text-slate-800 lg:flex-[14] border-2 border-slate-200 dark:border-slate-800"
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
								placeholder="Type any question here."
							/>
							<Button
								onClick={handleSend}
								className={`self-end w-full py-2 lg:flex-[1] ${
									isSending ? "cursor-not-allowed opacity-50" : ""
								}`}
								disabled={isSending}
								variant={!isSending ? "default" : "ghost"}
								size="lg"
							>
								{isSending ? (
									<span className="text-slate-800 font-semibold flex items-center gap-1">
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									</span>
								) : (
									<IoIosSend size={32} />
								)}
							</Button>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default ChatDrawer;
