// next.config.js
const webpack = require("webpack");

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',  // Match any path after /app
        destination: 'https://localhost:5000/:path*', // Proxy to localhost:5000
      },
    ];
  },
};
