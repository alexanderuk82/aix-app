// Email Validation
export const validateEmail = (email) => {
	if (!email.trim()) return "Email is required.";
	if (!/\S+@\S+\.\S+/.test(email)) return "Email address is invalid.";
	return "";
};

// Text Input Validation
export const validateText = (text) => {
	if (!text.trim()) return "This field is required.";
	// Add any other text validation logic here (length, specific characters, etc.)
	return "";
};

// Phone Number Validation
export const validatePhoneNumber = (phoneNumber) => {
	if (!phoneNumber.trim()) return "Phone number is required.";
	// Example: Validates US phone numbers
	if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneNumber)) {
		return "Phone number is invalid.";
	}
	return "";
};

// Radio Input Validation
export const validateRadio = (value) => {
	if (!value) return "Please make a selection.";
	return "";
};

// This function can be used to get the appropriate validator based on the input type
export const getValidator = (type) => {
	switch (type) {
		case "email":
			return validateEmail;
		case "text":
			return validateText;
		case "tel":
			return validatePhoneNumber;
		case "radio":
			return validateRadio;
		default:
			return () => ""; // No validation for unspecified types
	}
};
