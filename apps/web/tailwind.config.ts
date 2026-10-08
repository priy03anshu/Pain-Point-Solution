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
        background: '#080D18',
        card: '#101827',
        border: '#263449',
        primary: {
          DEFAULT: '#4F83F4',
          foreground: '#FFFFFF',
          hover: '#3D70DF'
        },
        accent: {
          DEFAULT: '#7CA8FF',
          foreground: '#FFFFFF'
        },
        success: '#10B981',
        warning: '#F59E0B',
        destructive: '#EF4444',
        muted: '#9AA8BC'
      }
    }
  },
  plugins: []
};

export default config;
