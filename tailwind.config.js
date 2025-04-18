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
        'blue-primary': '#0077CC',
        'bg-alt-1': '#F5FAFD',
        'bg-alt-2': '#E6F0FA',
        'bg-alt-3': '#F0F4F8',
        'navy-deep': '#003F73',
        'teal-accent': '#00B3A6',
        'gold-soft': '#FFC861',
        'text-main': '#1A1A1A',
        'text-sub': '#555F6E',
      },
      gradientColorStops: {
        'gradient-start': 'var(--gradient-start)',
        'gradient-end': 'var(--gradient-end)',
      },
      fontFamily: {
        heading: ['IBM Plex Sans', 'Poppins', 'sans-serif'],
        body: ['Open Sans', 'Source Sans Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 