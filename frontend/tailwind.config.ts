import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Already configure
        primary: {
          DEFAULT: "rgb(var(--primary))",
          10: "rgba(var(--primary), 10)",
          hover: "rgb(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          hover: "rgb(var(--secondary-hover))",
        },
        tertiary: "rgb(var(--tertiary))",

        success: "rgb(var(--success))",
        error: "rgb(var(--error))",
        warining: "var(--warining)",
        info: "var(--info)",

        background: {
          DEFAULT: "rgb(var(--background))",

          secondary: "rgba(var(--background), 0.9)",
          tertiary: "rgba(var(--background), 0.8)",
        },

        foreground: {
          DEFAULT: "var(--forregrond)",

          // Not configure yet
          primary: "var(--foreground-primary)",
          secondary: "var(--foreground-secondary)",
          accent: "var(--foreground-accent)",
          muted: "var(--foreground-muted)",
        },

        neutral: colors.gray,
        theme: colors.sky,
        gradient: {
          src: colors.teal,
          mid: colors.white,
          des: colors.fuchsia,
        },

        // Not configure yet
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",

          hover: "var(--gradient-primary)",
          hoverSecondary: "var(--gradient-secondary)",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        /* primary: {
                  DEFAULT: 'hsl(var(--primary))',
                  foreground: 'hsl(var(--primary-foreground))'
              },
              secondary: {
                  DEFAULT: 'hsl(var(--secondary))',
                  foreground: 'hsl(var(--secondary-foreground))'
              }, */

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",

          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          muted: "var(--accent-muted)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        border: {
          DEFAULT: "hsl(var(--border))",

          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
