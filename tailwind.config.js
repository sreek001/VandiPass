/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface':                    '#f8fafc',
        'surface-container-lowest':   '#ffffff',
        'glass-light-bg':             'rgba(255, 255, 255, 0.70)',
        'glass-light-border':         'rgba(255, 255, 255, 0.60)',
        'glass-dark-bg':              'rgba(2, 6, 23, 0.85)',
        'glass-dark-border':          'rgba(51, 65, 85, 0.50)',
      },
      fontFamily: {
        // Override Tailwind's built-in `font-mono` to JetBrains Mono
        mono:             ['JetBrains Mono', 'Courier New', 'monospace'],
        // Custom semantic aliases matching the HTML template
        'display-hero':   ['Space Grotesk', 'sans-serif'],
        'headline-lg':    ['Space Grotesk', 'sans-serif'],
        'headline-md':    ['Space Grotesk', 'sans-serif'],
        'headline-sm':    ['Space Grotesk', 'sans-serif'],
        'body-lg':        ['Inter', 'sans-serif'],
        'body-md':        ['Inter', 'sans-serif'],
        'body-sm':        ['Inter', 'sans-serif'],
        'telemetry-lg':   ['JetBrains Mono', 'monospace'],
        'telemetry-md':   ['JetBrains Mono', 'monospace'],
        'label-mono-sm':  ['JetBrains Mono', 'monospace'],
        'label-caps':     ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
