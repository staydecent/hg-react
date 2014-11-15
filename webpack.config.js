var path = require("path");

module.exports = {
  entry: {
    "hg-react": "./index.js",
    "hello-example": "./examples/hello.jsx"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
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
    ],
    loaders: [
      { test: /\.jsx$/, loader: "jsx-loader" }
    ]
  }
};