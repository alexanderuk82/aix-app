import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format time
export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", { timeStyle: "short" });
}

// Filter and sort interviews by date
export function filterInterviews(interviews) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time components

  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(today.getDate() - 1);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Sort interviews by createdAt date in descending order
  const sortedInterviews = [...interviews].sort(
    (a, b) =>
      new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
  );

  const interviewsToday = sortedInterviews.filter((interview) => {
    const createdAt = new Date(interview.attributes.createdAt);
    return createdAt >= today;
  });

  const interviewsLast7Days = sortedInterviews.filter((interview) => {
    const createdAt = new Date(interview.attributes.createdAt);
    return createdAt >= sevenDaysAgo && createdAt < today;
  });

  const interviewsLast30Days = sortedInterviews.filter((interview) => {
    const createdAt = new Date(interview.attributes.createdAt);
    return createdAt >= thirtyDaysAgo && createdAt < sevenDaysAgo;
  });

  return { interviewsToday, interviewsLast7Days, interviewsLast30Days };
}

//format name
export function formatName(fullName) {
  // Check if fullName is a string and it is not empty
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    const nameParts = fullName.trim().split(" "); // Trim and split the full name into parts
    if (nameParts.length > 1) {
      const firstNameInitial = nameParts[0][0]; // Get the first letter of the first name
      const lastName = nameParts[nameParts.length - 1]; // Get the last name
      return `${firstNameInitial}. ${lastName}`; // Combine and return the formatted name
    }
    return fullName; // Return the original name if it doesn't have at least two parts
  }
  return ""; // Return empty string if input is invalid
}

//  Generate a slug from a title
export function generateSlug(title) {
  return title
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple hyphens with a single hyphen
}
