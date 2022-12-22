const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://shop.funbloc.com.tw',
      changeOrigin: true,
    })
  );
};