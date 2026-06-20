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
                sans: ['Calibri', 'sans-serif'],
                mono: ['monospace'],
            },
            colors: {
                slate: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937', 
                    900: '#111827', 
                    950: '#030712',
                },
                blue: {
                    // Navy Blue (Lacivert) Scale
                    50: '#E6EAF2',
                    100: '#CDD6E5',
                    200: '#9AB0CB',
                    300: '#6889B2',
                    400: '#356398',
                    500: '#023E7D', // Main Navy
                    600: '#023264',
                    700: '#01254B',
                    800: '#011932',
                    900: '#000C19',
                    950: '#00060C',
                },
                purple: {
                    // Mute the purples to a grayish blue to fit the corporate theme
                    50: '#F0F4F8',
                    100: '#E1E9F1',
                    200: '#C4D3E3',
                    300: '#A6BDD5',
                    400: '#89A8C7',
                    500: '#6B92B9', 
                    600: '#567594',
                    700: '#40586F',
                    800: '#2B3B4A',
                    900: '#151D25',
                    950: '#0B0F13',
                },
                emerald: {
                    // Mute emerald to a very calm corporate green for success states
                    50: '#EBF2ED',
                    100: '#D7E6DB',
                    200: '#AFCCB7',
                    300: '#87B393',
                    400: '#5F996F',
                    500: '#37804B', 
                    600: '#2C663C',
                    700: '#214D2D',
                    800: '#16331E',
                    900: '#0B1A0F',
                    950: '#050D08',
                }
            }
        },
    },
    plugins: [],
};
export default config;
