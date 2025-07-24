import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // Semantic Chart Colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        // Sidebar Tokens
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // Custom Color Tokens for Reuse (NEW)
        blue: {
          DEFAULT: "hsl(var(--blue))",
          bg: "hsl(var(--blue-bg))",
        },
        "blue-bg": "hsl(var(--blue-bg))",
    
        green: {
          DEFAULT: "hsl(var(--green))",
          bg: "hsl(var(--green-bg))",
        },
        "green-bg": "hsl(var(--green-bg))",
    
        red: {
          DEFAULT: "hsl(var(--red))",
          bg: "hsl(var(--red-bg))",
        },
        "red-bg": "hsl(var(--red-bg))",
    
        indigo: {
          DEFAULT: "hsl(var(--indigo))",
          bg: "hsl(var(--indigo-bg))",
        },
        "indigo-bg": "hsl(var(--indigo-bg))",
    
        purple: {
          DEFAULT: "hsl(var(--purple))",
          bg: "hsl(var(--purple-bg))",
        },
        "purple-bg": "hsl(var(--purple-bg))",
    
        orange: {
          DEFAULT: "hsl(var(--orange))",
          bg: "hsl(var(--orange-bg))",
        },
        "orange-bg": "hsl(var(--orange-bg))",
    
        yellow: {
          DEFAULT: "hsl(var(--yellow))",
          bg: "hsl(var(--yellow-bg))",
        },
        "yellow-bg": "hsl(var(--yellow-bg))",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
