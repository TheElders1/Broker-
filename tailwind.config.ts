import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070D",
          900: "#090C14",
          850: "#0C101B",
          800: "#101422",
          700: "#161B2C",
          600: "#1E2438",
          500: "#2A3350",
        },
        gold: {
          200: "#F7E6B5",
          300: "#F0D98C",
          400: "#E6C264",
          500: "#D4AF37",
          600: "#B8912B",
          700: "#93701F",
        },
        royal: {
          300: "#7C93E8",
          400: "#5A75DC",
          500: "#3A54C4",
          600: "#28399B",
          700: "#1C2A73",
          800: "#141F52",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F0D98C 0%, #D4AF37 45%, #93701F 100%)",
        "royal-gradient": "linear-gradient(135deg, #5A75DC 0%, #28399B 100%)",
        "hero-radial":
          "radial-gradient(60% 60% at 80% 20%, rgba(58,84,196,0.28) 0%, rgba(5,7,13,0) 70%), radial-gradient(45% 45% at 10% 90%, rgba(212,175,55,0.14) 0%, rgba(5,7,13,0) 70%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(212,175,55,0.35)",
        "glow-blue": "0 0 50px -10px rgba(58,84,196,0.45)",
        card: "0 8px 30px -12px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
