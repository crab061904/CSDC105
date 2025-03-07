// server.js
//importing required modules
const http = require('http');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('./controller/productController');

//creating server and route handling
const server = http.createServer((req, res) => {
  //routing
  if (req.url === '/api/products' && req.method === 'GET') { //retrieve lahat na products
    getProducts(req, res);
  } else if (req.url.match(/\/api\/product\/\w+/) && req.method === 'GET') { //retrieve isang product
    const id = req.url.split('/')[3];
    getProduct(req, res, id);
  } else if (req.url === '/api/products' && req.method === 'POST') {
    createProduct(req, res);
  } else if (req.url.match(/\/api\/products\/\w+/) && req.method === 'PUT') {
    const id = req.url.split('/')[3];
    updateProduct(req, res, id);
  } else if (req.url.match(/\/api\/products\/\w+/) && req.method === 'DELETE') {
    const id = req.url.split('/')[3];
    deleteProduct(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Route Not Found: Please use the api/products endpoint',
      })
    );
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;