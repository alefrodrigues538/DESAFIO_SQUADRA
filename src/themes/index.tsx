import { extendTheme } from '@chakra-ui/react'

const colors = {
    global: {
        primary: '#3f1fbe',
        secondary: '#fefefe',
        third: '#db7414',
        primaryTransparent: '#3f1fbe60',
        secondaryTransparent: '#fefefe60',
        thirdTransparent: '#db741460',
        black: '#2e2e2e',
        white: '#FFFFFF'
    }
}

export const theme = extendTheme({ colors })