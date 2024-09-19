// utils/data.js

export const systemPrompt = {
	role: "system",
	content:
		"You are a highly experienced UX researcher and Customer Experience expert with many years of experience. Your goal is to analyze user feedback, identify frustrations, needs, and goals, and provide actionable recommendations to improve the product."
};

export const userPrompt = (textAreaInput) => ({
	role: "user",
	content: `
User Feedback:
"${textAreaInput}"

Task:
1. Identify and categorize the main user frustrations mentioned in the feedback.
2. Identify and categorize the user needs and goals.
3. Provide detailed and actionable recommendations to address the identified frustrations and needs, and to improve the overall user experience.

Output format:

Frustrations:
- [List of identified frustrations]

Needs:
- [List of identified needs and goals]

Goals:
- [List of identified needs and goals]

Recommendations:
- [List of detailed recommendations]
`
});
