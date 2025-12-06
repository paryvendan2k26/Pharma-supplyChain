/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: '#475569',        // Slate Blue - professional, calm
        'primary-dark': '#334155',  // Darker slate for hover states
        secondary: '#64748B',       // Warm Gray - text, borders
        accent: '#0891B2',          // Soft Teal - links, highlights
        bg: '#F8FAFC',              // Off-White/Cream - soft background
        surface: '#FFFFFF',         // White surfaces
        text: '#1E293B',            // Dark Charcoal - headings
        'text-light': '#64748B',    // Warm Gray - light text
        border: '#E2E8F0',          // Subtle borders (lighter warm gray)
        
        // Status Colors
        success: '#059669',         // Sage Green - subtle success
        error: '#DC2626',           // Muted Red - understated alerts
        warning: '#D97706',         // Warm Amber - warnings
        premium: '#7C3AED',         // Dusty Purple - premium features
        
        // Legacy support (mapped to new colors)
        'bg-alt': '#F1F5F9',        // Alternative background
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.08)',
        'organic': '0 2px 12px rgba(71, 85, 105, 0.08)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
