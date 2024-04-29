/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "task-pattern":
          "url('https://img.freepik.com/free-photo/crumpled-yellow-paper-background-close-up_60487-2390.jpg?ext=jpg&size=626')",
        "login-back": "url('./src/background.png')",
      },
      fontFamily: {
        neucha: ["Neucha", "cursive"],
      },
      colors: {
        custom: {
          50: "#32c3cd",
          100: "#eb6750",
          150: "#f4f5f7",
        },
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      transitionProperty: {
        height: "height",
        width: "width",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
