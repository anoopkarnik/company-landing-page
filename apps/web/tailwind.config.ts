import type { Config } from "tailwindcss";
export default {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
    },
    extend: {
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
      fontSize: {
        "title-h1": ["36px", { fontWeight: "900" }],
        "title-h2": ["30px", { fontWeight: "700" }],
        "title-h3": ["24px", { fontWeight: "600" }],
        "subtitle": ["20px", { fontWeight: "500" }],
        "emphasized": ["18px", { fontWeight: "600" }],
        "button": ["16px", { fontWeight: "400" }],
        "paragraph": ["14px", { fontWeight: "300" }],
        "description": ["12px", { fontWeight: "500" }],
        "code-snippet": ["12px", { fontWeight: "200" }],
      },
      fontFamily: {
        geistSans: ["var(--font-geist-sans)"],
        geistMono: ["var(--font-geist-mono)"],
        cyberdyne: ["var(--font-cyberdyne)"],
      }
    },
  },
} satisfies Config;
