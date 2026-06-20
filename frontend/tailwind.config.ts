import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Space Grotesk"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                slate: {
                    50: '#F4F5F7',
                    100: '#E4E7EC',
                    200: '#CBD0D9',
                    300: '#A1A9B8',
                    400: '#758094',
                    500: '#545E71',
                    600: '#3D465A',
                    700: '#2A3141',
                    800: '#1B202B', // Dark Cards
                    900: '#11151C', // Deeper Dark Cards
                    950: '#090A0E', // True Tech Background
                },
                blue: {
                    50: '#E6F0FF',
                    100: '#CCE0FF',
                    200: '#99C2FF',
                    300: '#66A3FF',
                    400: '#3385FF',
                    500: '#0066FF', // Pure Electric Blue
                    600: '#0052CC',
                    700: '#003D99',
                    800: '#002966',
                    900: '#001433',
                    950: '#000A1A',
                },
                emerald: {
                    50: '#E6FFF5',
                    100: '#CCFFEA',
                    200: '#99FFD5',
                    300: '#66FFC0',
                    400: '#33FFAA',
                    500: '#00FF95', // Matrix Neon Green
                    600: '#00CC77',
                    700: '#009959',
                    800: '#00663C',
                    900: '#00331E',
                    950: '#001A0F',
                },
                purple: {
                    50: '#F5E6FF',
                    100: '#EACCFF',
                    200: '#D599FF',
                    300: '#BF66FF',
                    400: '#AA33FF',
                    500: '#9500FF', // Neon Violet
                    600: '#7700CC',
                    700: '#590099',
                    800: '#3C0066',
                    900: '#1E0033',
                    950: '#0F001A',
                }
            }
        },
    },
    plugins: [],
};
export default config;
