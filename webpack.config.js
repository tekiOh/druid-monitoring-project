module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
         test: /\.css$/,
         use: ['style-loader', 'css-loader']
      },
    ]
  },
    resolve: {
    extensions: ['.js', '.jsx'],
  }
};
