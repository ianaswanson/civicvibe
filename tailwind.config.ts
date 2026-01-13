import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Orange (energy, innovation, approachability)
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Main orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
          DEFAULT: "#f97316",
        },
        // Secondary: Slate (professionalism, trust, government association)
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
          DEFAULT: "#475569",
        },
        // Accent: Teal (innovation, digital, tech)
        accent: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          DEFAULT: "#14b8a6",
        },
        // Utility colors
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          700: "#15803d",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          700: "#b45309",
        },
        error: {
          50: "#fef2f2",
          500: "#ef4444",
          700: "#b91c1c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        heading: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Fira Code", "Consolas", "Monaco", "monospace"],
      },
      fontSize: {
        "body-sm": ["1rem", { lineHeight: "1.6" }],
        body: ["1.125rem", { lineHeight: "1.7" }],
        "body-lg": ["1.25rem", { lineHeight: "1.7" }],
        "body-xl": ["1.5rem", { lineHeight: "1.6" }],
        h1: ["3rem", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["1.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.375rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

export default config;
