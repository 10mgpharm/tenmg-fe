import { Box, HStack, useRadio, useRadioGroup, UseRadioProps } from "@chakra-ui/react"
import { ReactNode } from "react"

const RadioCard = (props: UseRadioProps & { children: ReactNode }) => {
    const { getInputProps, getRadioProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getRadioProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='md'
                // boxShadow='md'
                _checked={{
                    bg: 'primary.50',
                    borderColor: 'primary.300',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                px={3}
                py={1}
                minW={{ base: 'fit-content', md: '100px' }}
                textAlign={'center'}
                outline={'none'}
            >
                {props.children}
            </Box>
        </Box>
    )
}

type Props = {
    name: string;
    options: string[],
    onChangeCallback?: (nextValue: string) => void,
    defaultValue?: any
}

const CustomRadio = ({ name, options, onChangeCallback, defaultValue = '' }: Props) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name,
        defaultValue: options.find(option => option.toLowerCase() === defaultValue?.toLowerCase()) ?? options[0],
        onChange: (nextValue: string) => {
            (
                onChangeCallback &&
                typeof onChangeCallback === 'function' &&
                onChangeCallback(nextValue)
            )
        },
    })

    const group = getRootProps()

    return (
        <HStack {...group}>
            {options.map((value) => {
                const radio = getRadioProps({ value })
                return (
                    <RadioCard key={value} {...radio}>
                        {value}
                    </RadioCard>
                )
            })}
        </HStack>
    )
}

export default CustomRadio
