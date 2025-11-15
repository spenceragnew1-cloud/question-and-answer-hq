import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#009688",
          light: "#26a69a",
          dark: "#00796b",
        },
        gray: {
          bg: "#f7f7f7",
        },
      },
    },
  },
  plugins: [],
};
export default config;

