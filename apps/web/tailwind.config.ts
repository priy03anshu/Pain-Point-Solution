import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        card: '#111827',
        border: '#1F2937',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
          hover: '#2563EB'
        },
        accent: {
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF'
        },
        success: '#10B981',
        warning: '#F59E0B',
        destructive: '#EF4444',
        muted: '#9CA3AF'
      }
    }
  },
  plugins: []
};

export default config;
