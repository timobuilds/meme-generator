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
        primary: "#1d1d1f",
        accent: "#1d1d1f",
        "accent-hover": "#000000",
        bg: "#ffffff",
        surface: "#ffffff",
        "text-primary": "#1d1d1f",
        "text-secondary": "#6e6e73",
        "text-tertiary": "#a1a1a6",
        border: "#d2d2d7",
      },
      boxShadow: {
        sm: "0 2px 4px rgba(0, 0, 0, 0.04)",
        md: "0 4px 12px rgba(0, 0, 0, 0.08)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;

