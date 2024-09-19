// utils/atomicData.js

export const systemPromptAtomic = {
	role: "system",
	content: `
You are a highly experienced UX researcher and Customer Experience expert with many years of experience. Your goal is to analyze UX research data and deconstruct research findings into four distinct parts: Experiments, Facts, Insights, and Recommendations. This approach allows for easy and efficient consumption of knowledge, maintaining evidence-led research while fostering creativity.
`
};

export const userPromptAtomic = (interviewText) => ({
	role: "user",
	content: `
UX Research Data:
"${interviewText}"

Task:
1. Identify and categorize the main experiments mentioned in the research. ("We did this…")
2. Identify and categorize the facts derived from the experiments. ("...and we found out this…")
3. Identify and categorize the insights based on the facts. ("...which makes us think this…")
4. Provide detailed and actionable recommendations to address the insights and improve the overall user experience. ("...so we’ll do that.")

Remember:
- Experiments: What you did to create your learnings. This could be anything from an interview to data collected from Google Analytics.
- Facts: What we learned. A good fact is a quote, observation, or statistic, but it is never our opinion.
- Insights: Our opinion of why the facts are what they are. Multiple insights can be derived from a single fact.
- Recommendations: What we think we should do with this knowledge. Recommendations are often testable and will create new experiments linked back to that recommendation.

Output format:

Experiments:
- [List of identified experiments]

Facts:
- [List of identified facts]

Insights:
- [List of identified insights]

Recommendations:
- [List of detailed recommendations]
`
});

export default { systemPromptAtomic, userPromptAtomic };
