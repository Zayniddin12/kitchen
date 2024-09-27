/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'menu': '0px 1.5px 4px -1px #0A090B12',
      },
      colors: {
        "blue-50": "var(--blue-50)",
        "blue-100": "var(--blue-100)",
        "blue-200": "var(--blue-200)",
        "blue-300": "var(--blue-300)",
        "blue-400": "var(--blue-400)",
        "blue-500": "var(--blue-500)",
        "blue-600": "var(--blue-600)",
        "blue-700": "var(--blue-700)",
        "blue-800": "var(--blue-800)",
        "blue-900": "var(--blue-900)",
        "dark": "#000D24",
        "dark-gray": "#4F5662",
        "white-blue": "var(--white-blue)",
        "cool-gray": "#8F9194",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background:
          "hsl(var(--background))",
        foreground:
          "hsl(var(--foreground))",
        primary: {
          DEFAULT:
            "hsl(var(--primary))",
          foreground:
            "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:
            "hsl(var(--secondary))",
          foreground:
            "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:
            "hsl(var(--destructive))",
          foreground:
            "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground:
            "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground:
            "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:
            "hsl(var(--popover))",
          foreground:
            "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground:
            "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: {
            height:
              "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height:
              "var(--radix-accordion-content-height)",
          },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: {
            height:
              "var(--radix-collapsible-content-height)",
          },
        },
        "collapsible-up": {
          from: {
            height:
              "var(--radix-collapsible-content-height)",
          },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down":
          "accordion-down 0.2s ease-out",
        "accordion-up":
          "accordion-up 0.2s ease-out",
        "collapsible-down":
          "collapsible-down 0.2s ease-in-out",
        "collapsible-up":
          "collapsible-up 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
