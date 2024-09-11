'use client'

import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ChakraProvider theme={theme}>
            {children}
        </ChakraProvider>
    );
}

export default ThemeProvider;