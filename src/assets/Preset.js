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
          0: '#fafafa',
          50: '#f5f5f5',
          100: '#eeeeee',
          200: '#e0e0e0',
          300: '#bdbdbd',
          400: '#9e9e9e',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#212121',
          900: '#121212',
          950: '#000000',
        },
        primary: {
          color: '{primary.600}',
          contrastColor: '#fafafa',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
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
