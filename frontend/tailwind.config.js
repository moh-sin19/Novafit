module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "auth-bg": "url('/src/assets/images/auth-bg.png')",
        "banner-light-desktop-bg":
          "url('/src/assets/images/banner-bg-desktop.png')",
        "banner-light-mobile-bg":
          "url('/src/assets/images/banner-bg-mobile.png')",
        "banner-dark-desktop-bg":
          "url('/src/assets/images/banner-bg-desktop-dark.png')",
        "banner-dark-mobile-bg":
          "url('/src/assets/images/banner-bg-mobile-dark.png')",
      },
      fontFamily: {
        inter: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        lime: {
          50: "#FDFFE9",
          100: "#F9FFC7",
          200: "#F3FF9E",
          300: "#EEFF7D",
          400: "#EAFE63",
          500: "#D6E14F",
          600: "#B7C73C",
          700: "#97A92C",
          800: "#6F7D1F",
          900: "#4A5213",
        },
        lavender: {
          50: "#F9F4FB",
          100: "#F0E1F5",
          200: "#E1C9EB",
          300: "#D5B4E0",
          400: "#CDA8DA",
          500: "#B389C5",
          600: "#9A6EAE",
          700: "#7C5590",
          800: "#5D3E6C",
          900: "#3E294A",
        },
        aqua: {
          50: "#F4FCFD",
          100: "#E8FAFB",
          200: "#CFF4F8",
          300: "#B6EBF1",
          400: "#D0F5F9",
          500: "#A8E4EC",
          600: "#7ECFD9",
          700: "#55B3C2",
          800: "#318EA0",
          900: "#1E5E6A",
        },
      },
    },
  },
  plugins: [],
};
