const path = require('path')

module.exports = {
    entry: "./js/script",
    mode: "production",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new Dotenv()
    ]
};