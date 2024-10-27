const { default: axios } = require("axios");
import { systemPrompt, userPrompt } from "./data";
import { systemPromptAtomic, userPromptAtomic } from "./atomicData";
import { systemPromptChat, userPromptChat } from "./chatData";

// get API key from .env file PRODUCTION

const API_KEY = process.env.NEXT_PUBLIC_STRAPI_API_KEY;

const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
	headers: {
		Authorization: `Bearer ${API_KEY}`
	}
});

const postNewUXDesigner = (data) => axiosClient.post("/user-names", data);

//Post New Interview on strapi backend

const postNewInterview = (data) => axiosClient.post("/interviews", data);

//Post New Updtate Interview on strapi backend

const updateInterview = (id, data) =>
	axiosClient.put(`/interviews/${id}`, data);

//Get Interview List

const getInterviews = () => axiosClient.get("/interviews?populate=*");

//get Designergit s

const getDesigner = () => axiosClient.get(`/user-names?populate=*`);

//get Status

const getStatus = () => axiosClient.get(`/statuses`);

//Get user By the email

const getUserByEmail = (email) => {
	return axiosClient.get(`/user-names?filters[email]=${email}&populate=*`);
};

//Get companies from strapi backend

const getCompanies = () => axiosClient.get("/companies");

// Get companies from strapi backend filtering by name

const getCompaniesByUserId = async (userId) => {
	try {
		const response = await axiosClient.get(
			`/companies?filters[user][id][$eq]=${userId}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching companies by user ID:", error);
		throw error;
	}
};

// Post new company on strapi backend
const postNewCompany = (data) => axiosClient.post("/companies", data);

// //post status to user-names strapi backend
// const postStatus = (data) => axiosClient.post("/user-names", data);

//Post new UX Analysis on strapi backend

const postNewUXAnalysis = (data) => axiosClient.pUT("/ux-analyses", data);

// 	try {
// 		const systemPrompt = {
// 			role: "system",
// 			content: `You are a helpful assistant acting as a UX researcher.`
// 		};

// 		const userPrompt = {
// 			role: "user",
// 			content: `Given the following user feedback you as Expert on UX research and Customer Experience: "${textAreaInput}", provide a detailed analysis categorizing user frustrations, needs, and suggest actionable categorizing for Goals separate and as well category for recommendation to improvement our product.`
// 		};

// 		const response = await openAiClient.post("/chat/completions", {
// 			model: "gpt-4",
// 			messages: [systemPrompt, userPrompt]
// 		});

// 		console.log("API Response:", response.data);

// 		if (!response.data.choices || response.data.choices.length === 0) {
// 			throw new Error("No choices available in the OpenAI response.");
// 		} // We expect the AI to provide structured output that we can parse into categories

// 		const categorizedResponse = parseAiResponse(
// 			response.data.choices[0].message.content
// 		);
// 		return categorizedResponse;
// 	} catch (error) {
// 		console.error("Failed to fetch data from OpenAI:", error);
// 		throw error;
// 	}

// OpenAI API Configuration
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openAiClient = axios.create({
	baseURL: "https://api.openai.com/v1",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${OPENAI_API_KEY}`
	}
});

// UX ANALYSIS RESULTS
const fetchOpenAiResponse = async (textAreaInput) => {
	try {
		const response = await openAiClient.post("/chat/completions", {
			model: "gpt-4",
			messages: [systemPrompt, userPrompt(textAreaInput)]
		});

		console.log("API Response:", response.data);

		if (!response.data.choices || response.data.choices.length === 0) {
			throw new Error("No choices available in the OpenAI response.");
		}

		// We expect the AI to provide structured output that we can parse into categories
		const categorizedResponse = parseAiResponse(
			response.data.choices[0].message.content
		);
		return categorizedResponse;
	} catch (error) {
		console.error("Failed to fetch data from OpenAI:", error);
		throw error;
	}
};

const parseAiResponse = (responseContent) => {
	const categories = {
		frustration: [],
		needs: [],
		goals: [],
		recommendations: []
	};

	const categoryKeys = Object.keys(categories);
	let currentCategory = null; // Use regular expressions to match category headers more flexibly

	const categoryRegex = {
		frustration: /(frustration|user frustrations)/i,
		needs: /(user needs|needs)/i,
		goals: /(goals|user goals)/i,
		recommendations:
			/(recommendations for product improvement|recommendations)/i
	};

	responseContent.split("\n").forEach((line) => {
		// console.log(`Processing line: ${line}`); // More detailed logging

		if (line.trim() === "") return; // Skip empty lines

		const foundCategory = categoryKeys.find((key) =>
			line.match(categoryRegex[key])
		);

		if (foundCategory) {
			currentCategory = foundCategory;
		} else if (currentCategory && line.match(/^\d+\./)) {
			// Check if the line starts with a digit followed by a dot for list items
			// Remove the number and dot from the start of the line
			const cleanLine = line.replace(/^\d+\.\s*/, "");
			categories[currentCategory].push(cleanLine.trim());
		}
	});

	console.log("Categorized Responses:", categories);
	return categories;
};

// UX ATOMIC

const fetchOpenAiAtomicResponse = async (textAreaInput) => {
	try {
		const response = await openAiClient.post("/chat/completions", {
			model: "gpt-4",
			messages: [systemPromptAtomic, userPromptAtomic(textAreaInput)]
		});

		console.log("API Response:", response.data);

		if (!response.data.choices || response.data.choices.length === 0) {
			throw new Error("No choices available in the OpenAI response.");
		}

		const categorizedResponse = parseAiAtomicResponse(
			response.data.choices[0].message.content
		);
		return categorizedResponse;
	} catch (error) {
		console.error("Failed to fetch data from OpenAI:", error);
		throw error;
	}
};

const parseAiAtomicResponse = (responseContent) => {
	const categories = {
		experiments: [],
		fact: [],
		insight: [],
		recommendation: []
	};

	const categoryKeys = Object.keys(categories);
	let currentCategory = null;

	const categoryRegex = {
		experiments: /(experiments|experiment)/i,
		fact: /(fact|facts)/i,
		insight: /(insight|insights)/i,
		recommendation: /(recommendations|recommendation)/i
	};

	responseContent.split("\n").forEach((line) => {
		if (line.trim() === "") return;

		const foundCategory = categoryKeys.find((key) =>
			line.match(categoryRegex[key])
		);

		if (foundCategory) {
			currentCategory = foundCategory;
		} else if (currentCategory && line.match(/^\d+\./)) {
			const cleanLine = line.replace(/^\d+\.\s*/, "");
			categories[currentCategory].push(cleanLine.trim());
		}
	});

	console.log("Categorized Atomic Responses:", categories);
	return categories;
};

// CHAT DRAWER COMPONENT

// export const fetchChatAiResponse = async (question, userContext) => {
// 	const prompts = {
// 		role: "system",
// 		content: `You are a helpful assistant UX expert. Based on the user's previous activity: "${userContext}", please provide a response.`
// 	};

// 	const userPrompt = {
// 		role: "user",
// 		content: question
// 	};

// 	try {
// 		const response = await openAiClient.post("/chat/completions", {
// 			model: "gpt-4",
// 			messages: [prompts, userPrompt]
// 		});

// 		if (!response.data.choices || response.data.choices.length === 0) {
// 			throw new Error("No choices available from the OpenAI response.");
// 		}

// 		return response.data.choices[0].message.content;
// 	} catch (error) {
// 		console.error("Failed to fetch data from OpenAI:", error);
// 		throw error;
// 	}
// };

export const fetchChatAiResponse = async (question, userContext) => {
	const systemPrompt = systemPromptChat;
	const userPrompt = userPromptChat(question, userContext);

	try {
		const response = await openAiClient.post("/chat/completions", {
			model: "gpt-4",
			messages: [systemPrompt, userPrompt]
		});

		if (!response.data.choices || response.data.choices.length === 0) {
			throw new Error("No choices available from the OpenAI response.");
		}

		return response.data.choices[0].message.content;
	} catch (error) {
		console.error("Failed to fetch data from OpenAI:", error);
		throw error;
	}
};

export default {
	getInterviews,
	postNewUXDesigner,
	getUserByEmail,
	postNewCompany,
	getCompaniesByUserId,
	fetchOpenAiResponse,
	fetchChatAiResponse,
	postNewInterview,
	getCompanies,
	getDesigner,
	getStatus,
	postNewUXAnalysis,
	updateInterview,
	fetchOpenAiAtomicResponse,
	parseAiAtomicResponse
};
