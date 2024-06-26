/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
        colors: {
            'main_bg_color': '#121212',
            'secondary_bg_color': '#232323',
            'third_bg_color': '#2E2E2E',
            'main_box_color': '#1E1E1E',
            'secondary_box_color': '#2E2E2E',
            'schuberg_blue': '#1E80ED',
            'wit': '#FFFFFF',
            "profile-grijs": '#7C7C7C',
            "rood": "#db2525",
            "box-information-text": "#7C7C7C",

            "Confirmation": "#1E80ED",
        },
    },
    plugins: [],
}

