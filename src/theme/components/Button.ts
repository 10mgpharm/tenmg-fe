import { colors } from "@/theme/constants";

const buttonTheme = {
    baseStyle: {
        fontWeight: 500,
    },
    sizes: {
        md: {
            h: '48px',
            fontSize: 16,
            px: '32px',
        },
    },
    variants: {
        solid: (props: { colorMode: string; colorScheme: string }) => ({
            bg: props.colorScheme === 'red' 
                ? 'red.500'
                : props.colorMode === 'dark' ? 'primary.500' : 'primary.500',
            color: 'white',
            _hover: {
                bg: props.colorScheme === 'red'
                    ? 'red.600'
                    : props.colorMode === 'dark' ? 'blue.200' : 'blue.600',
            },
            _active: {
                bg: props.colorScheme === 'red'
                    ? 'red.700'
                    : props.colorMode === 'dark' ? 'blue.400' : 'blue.700',
            },
        }),
    },
    defaultProps: {
        size: 'md',
        variant: 'solid',
        colorScheme: 'blue',
    },
}

export default buttonTheme;