/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        cta: 'var(--cta)',
        'cta-dark': 'var(--cta-dark)',
        'light-gray': 'var(--light-gray)',
        success: 'var(--success)',
        error: 'var(--error)',
        'card-bg': 'var(--card-bg)',
        border: 'var(--border)',
      },
      gradientColorStops: {
        'gradient-start': 'var(--gradient-start)',
        'gradient-end': 'var(--gradient-end)',
      },
    },
  },
  plugins: [],
} 