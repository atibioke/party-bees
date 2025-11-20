/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#F59E0B', // Amber 500 - Party Bees color?
                secondary: '#1F2937', // Gray 800
            }
        },
    },
    plugins: [],
}
