import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#F5F0EB",
        "bg-secondary": "#EBE5D9",
        surface: "#FFFFFF",
        "surface-hover": "#F0EBE5",
        "accent-pink": "#E50071",
        "accent-black": "#1A1A1A",
        "text-primary": "#1A1A1A",
        "text-secondary": "#4A4A4A",
        "text-muted": "#888888",
        border: "#1A1A1A",
        success: "#00B894",
        warning: "#F97316",
        danger: "#E50071",
      },
      fontFamily: {
        display: ['Impact', '"Arial Black"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"Courier New"', 'Consolas', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
    },
  },
  plugins: [],
} satisfies Config;
