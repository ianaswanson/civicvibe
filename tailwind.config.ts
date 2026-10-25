import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // The whole site is printed in the homepage's inks (design/homepage): white lines cut
      // into black, lit by the two doors. Green is door 1, pink is door 2.
      colors: {
        ink: {
          DEFAULT: "#0a100c",
          deep: "#030604", // the inside of the tree
          raised: "#131b16", // a panel set into the page: code, tables, the chains
        },
        paper: "#f6f7f6",
        door: {
          green: "#0cf256", // on ink 12.7:1
          pink: "#f417ad", // on ink 5.1:1
          magenta: "#cc008b", // the hand-ruled stroke; never text on ink
          // whichever door this page sits behind; set by .door-1 / .door-2 in globals.css
          lit: "rgb(var(--door) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-schibsted)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      // The homepage's scale (ratio 1.322 from 1.125rem), named for what each step is for.
      fontSize: {
        small: ["0.8475rem", { lineHeight: "1.5" }],
        body: ["1.125rem", { lineHeight: "1.6" }],
        "body-lg": ["1.487rem", { lineHeight: "1.45" }],
        h4: ["1.487rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h3: ["1.966rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        h2: ["2.599rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        h1: ["3.436rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        display: ["4.542rem", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
      },
      maxWidth: {
        measure: "40rem", // the shaft: every reading column shares it
      },
      spacing: {
        portal: "14rem", // the doorway's column plus its gap, so later text lines up with the first words
      },
      gridTemplateColumns: {
        portal: "11rem minmax(0, 1fr)", // a door's landing page: the doorway, then the words
      },
    },
  },
  plugins: [],
};

export default config;
