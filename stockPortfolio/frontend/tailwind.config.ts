import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        frontPage: "#2b7a78",
        lightGrey: "#f2f2f2",
        darkGreen: "#182626",
      },
    },
  },
  plugins: [],
} satisfies Config;
