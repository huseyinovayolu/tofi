/** @type {import('tailwindcss').Config} */
module.exports = {
  // Extend the base config from @tofi/config
  presets: [require('@tofi/config/tailwind')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Additional Swiss-specific customizations for customer app
      colors: {
        primary: {
          DEFAULT: '#ef4444', // Swiss red
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        accent: {
          DEFAULT: '#f59e0b',
          foreground: '#1f2937',
        },
        background: '#ffffff',
        foreground: '#1f2937',
        muted: {
          DEFAULT: '#f9fafb',
          foreground: '#6b7280',
        },
        border: '#e5e7eb',
        input: '#e5e7eb',
        ring: '#ef4444',
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};