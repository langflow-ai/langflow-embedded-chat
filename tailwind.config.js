/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				".scrollbar-hide": {
					/* IE and Edge */
					"-ms-overflow-style": "none",
					/* Firefox */
					"scrollbar-width": "none",
					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},
			});
		}),
	],
};
