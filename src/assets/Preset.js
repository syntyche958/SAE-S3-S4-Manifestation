import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const Preset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{emerald.50}',
      100: '{emerald.100}',
      200: '{emerald.200}',
      300: '{emerald.300}',
      400: '{emerald.400}',
      500: '{emerald.500}',
      600: '{emerald.600}',
      700: '{emerald.700}',
      800: '{emerald.800}',
      900: '{emerald.900}',
      950: '{emerald.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#1a1a1a',
          50: '#1e1e1e',
          100: '#2d2d2d',
          200: '#3d3d3d',
          300: '#4d4d4d',
          400: '#5d5d5d',
          500: '#7d7d7d',
          600: '#9d9d9d',
          700: '#bdbdbd',
          800: '#dedede',
          900: '#eeeeee',
          950: '#fafafa',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#fafafa',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        highlight: {
          background: '{primary.600}',
          focusBackground: '{primary.700}',
          color: '#fafafa',
          focusColor: '#fafafa',
        },
      },
    },
  },
})

export default Preset
