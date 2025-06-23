/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "animate-gradient-move",
    "bg-[length:200%_200%]",
    "bg-gradient-to-r",
    "from-pink-500",
    "via-orange-400",
    "to-yellow-400",
    "bg-clip-text",
    "text-transparent"
  ],
  theme: {
    extend: {
      backgroundSize: {
        "200%": "200%",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "gradient-move": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        blob: "blob 20s infinite ease-in-out",
        "gradient-move": "gradient-move 6s ease infinite",
      },
    },
  },
  plugins: [],
};
