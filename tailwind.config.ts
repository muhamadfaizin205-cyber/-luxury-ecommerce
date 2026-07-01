import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#000000",
          white: "#FFFFFF",
          gray: {
            50:  "#F5F5F5",
            100: "#EEECEB",
            200: "#D9D7D4",
            400: "#A8A5A2",
            600: "#6E6C69",
          },
        },
      },
      borderRadius: {
        none: "0px",
      },
      letterSpacing: {
        luxury: "0.22em",
        wide:   "0.18em",
        wider:  "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
