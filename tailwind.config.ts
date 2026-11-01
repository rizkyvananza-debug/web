import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { wine: "#6d1e35", ink: "#100d10", paper: "#eee5d8", gold: "#c8a66a" },
    fontFamily: { display: ["Georgia", "serif"] }
  }},
  plugins: []
};
export default config;
