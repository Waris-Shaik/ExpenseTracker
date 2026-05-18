import type { Config } from "tailwindcss";

const config: Config = {
  // This tells Tailwind to look for class names in these files
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable dark mode using a CSS class on the <html> element
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
