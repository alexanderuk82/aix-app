/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,jsx, ts, tsx}",
		"./components/**/*.{js,jsx, ts, tsx}",
		"./app/**/*.{js,jsx, ts, tsx}",
		"./src/**/*.{js,jsx, ts, tsx}"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" }
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out"
			},
			gridTemplateColumns: {
				// Add your custom grid template here
				special: "repeat(auto-fit, minmax(17rem, 1fr))"
			}
		}
	},
	plugins: [require("tailwindcss-animate")]
};
