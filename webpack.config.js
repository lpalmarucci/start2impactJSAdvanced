const path = require('path')
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: "./js/script.js",
    mode: "production",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new Dotenv()
    ]
};