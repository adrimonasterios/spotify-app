const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/_routes/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#1e8177",
        },
        secondary: {
          400: "#0d0d0d",
        },
        text: {
          400: "#1b1b1b",
        },
      },
      fontSize: {
        "10xl": "11rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addBase, theme }) {
      addBase({
        h3: {
          fontSize: theme("fontSize.lg"),
          fontFamily: theme("fontFamily.sans"),
          fontWeight: theme("fontWeight.medium"),
          color: theme("colors.text.400"),
        },
        p: {
          fontSize: theme("fontSize.sm"),
          color: theme("colors.gray.500"),
        },
        li: {
          fontSize: theme("fontSize.sm"),
          color: theme("colors.gray.500"),
        },
        button: {
          transitionDuration: "0.25s",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
      });
    }),
  ],
};
