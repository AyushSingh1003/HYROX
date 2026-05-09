import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#050505",
        carbon: "#0A0A0A",
        limefire: "#B6FF3B",
        signal: "#2CF7A6",
        volt: "#DBFF72"
      },
      fontFamily: {
        sans: ["Inter", "Satoshi", "SF Pro Display", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

