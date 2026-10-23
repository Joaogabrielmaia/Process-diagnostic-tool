import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16202a",
        brand: { 50: "#eef7f5", 100: "#d5ece7", 500: "#1f8a78", 600: "#17705f", 700: "#125a4d" },
      },
      fontFamily: { sans: ["Segoe UI", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
