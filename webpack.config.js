var path = require("path");

module.exports = {
  entry: {
    "hg-react": "./index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].min.js",
    library: ["React"],
    libraryTarget: "umd"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "jshint-loader"
      }
    ]
  }
};