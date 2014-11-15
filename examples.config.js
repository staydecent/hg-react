var path = require("path");

module.exports = {
  entry: {
    "hello": "./examples/hello.jsx",
    "todos": "./examples/todos.jsx"
  },
  output: {
    path: path.join(__dirname, "examples"),
    filename: "[name].js"
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