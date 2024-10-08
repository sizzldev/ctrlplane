import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@ctrlplane/tailwind-config/web";

/** @type {import('tailwindcss').Config} */
export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [
    ...baseConfig.content,
    "../../packages/ui/src/**/*.{ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./theme.config.tsx",
  ],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {},
    },
  },
} satisfies Config;
