import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
    content: [
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    darkMode: "class",
    plugins: [nextui({
        prefix: "tenmg",
        addCommonColors: false,
        defaultTheme: "light",
        defaultExtendTheme: "light",
        layout: {
            dividerWeight: "1px", // h-divider the default height applied to the divider component
            disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
            fontSize: {
                tiny: "0.75rem", // text-tiny
                small: "0.875rem", // text-small
                medium: "1rem", // text-medium
                large: "1.125rem", // text-large
            },
            lineHeight: {
                tiny: "1rem", // text-tiny
                small: "1.25rem", // text-small
                medium: "1.5rem", // text-medium
                large: "1.75rem", // text-large
            },
            radius: {
                small: "8px", // rounded-small
                medium: "12px", // rounded-medium
                large: "14px", // rounded-large
            },
            borderWidth: {
                small: "1px", // border-small
                medium: "2px", // border-medium (default)
                large: "3px", // border-large
            },
        },
        themes: {
            light: {
                layout: {
                    hoverOpacity: 0.8,
                    boxShadow: {
                        small:
                            "0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
                        medium:
                            "0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
                        large:
                            "0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
                    },
                },
                colors: {
                    background: "#FFFFFF", // or DEFAULT
                    foreground: "#ECEDEE", // or 50 to 900 DEFAULT
                    primary: {
                        50: "#E8F1F8",
                        100: "#B8D3E9",
                        200: "#96BDDE",
                        300: "#669FCF",
                        400: "#488DC6",
                        500: "#1A70B8",
                        600: "#1866A7",
                        700: "#125083",
                        800: "#0E3E65",
                        900: "#0B2F4D",
                        foreground: "#FFFFFF",
                        DEFAULT: "#1A70B8",
                    },
                    secondary: {
                        50: "#FBEAEA",
                        100: "#F2BEBF",
                        200: "#EB9F9F",
                        300: "#E27374",
                        400: "#DD5859",
                        500: "#D42E2F",
                        600: "#C12A2B",
                        700: "#972121",
                        800: "#75191A",
                        900: "#591314",
                        foreground: "#FFFFFF",
                        DEFAULT: "#D42E2F",
                    },
                    success: {
                        50: "#F6FEF9",
                        100: "#ECFDF3",
                        200: "#D1FADF",
                        300: "#A6F4C5",
                        400: "#6CE9A6",
                        500: "#32D583",
                        600: "#039855",
                        700: "#027A48",
                        800: "#05603A",
                        900: "#054F31",
                        foreground: "#FFFFFF",
                        DEFAULT: "#039855",
                    },
                    // ... rest of the colors
                }
            },
            dark: {
                layout: {
                    hoverOpacity: 0.9,
                    boxShadow: {
                        small: // shadow-small
                            "0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
                        medium: // shadow-medium
                            "0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
                        large: // shadow-large
                            "0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
                    },
                },
                colors: {
                    background: "#000000", // or DEFAULT
                    foreground: "#ECEDEE", // or 50 to 900 DEFAULT
                    primary: {
                        //... 50 to 900
                        foreground: "#FFFFFF",
                        DEFAULT: "#1A70B8",
                    },
                    secondary: {
                        //... 50 to 900
                        foreground: "#FFFFFF",
                        DEFAULT: "#D42E2F",
                    },
                },
            },
            // ... custom themes
        },
    })],
};
export default config;
