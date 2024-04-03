// const EVENT_COLORS = require('./src/context/useEvents.ts')
import { EVENT_COLORS } from './src/utils/eventColors'
const colorSafeList = []

const EVENT_COLOR_VALUES = [200, 500, 600]
EVENT_COLORS.forEach(color => {
  EVENT_COLOR_VALUES.forEach(value => {
    colorSafeList.push(`text-${color}-${value}`)
    colorSafeList.push(`bg-${color}-${value}`)
    colorSafeList.push(`before:bg-${color}-${value}`)
    colorSafeList.push(`border-${color}-${value}`)
    colorSafeList.push(`ring-${color}-${value}`)
  })
})

/** @type {import('tailwindcss').Config} */
export default {
  safelist: colorSafeList,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridAutoRows: {
        '100px': 'minmax(100px, 1fr)',
      },
      keyframes: {
        fadeIn: {
          '0%': { 
            backgroundColor: 'rgba(248, 250, 252, 0)', 
            backdropFilter: 'blur(0px)' 
          },
          '100%': { 
            backgroundColor: 'rgba(248, 250, 252, 0.5)', 
            backdropFilter: 'blur(4px)' 
          },
        },
        popIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out forwards',
        'fade-out': 'fadeIn 200ms ease-in-out forwards reverse',
        'pop-in': 'popIn 250ms ease-in-out forwards',
        'pop-out': 'popIn 250ms ease-in-out forwards reverse',
      },
      fontFamily: {
        'sans': ['new-science', 'sans-serif']
      }
    },
  },
  plugins: [],
}

