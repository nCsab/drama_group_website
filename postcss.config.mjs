export default {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 3,
      features: {
        "nesting-rules": false,
      },
    },
    autoprefixer: {}, // Fixes legacy browser design discrepancies (like old Comet browser)
  },
};
