import * as React from "react";

import { NextUIProvider } from "@nextui-org/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    );
}