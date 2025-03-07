const Product = require('../model/productModel');
const { getPostData } = require('../utils');


async function getProducts(req, res) {
    try {
        const products = await Product.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
    } catch (error) {
        console.log(error);
    }
}

async function getProduct(req, res) {
    try {
        const id = req.url.split('/')[3]; // Fix: Extract id properly
        const product = await Product.findById(id);
        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        }
    } catch (error) {
        console.log(error);z
    }
}

async function createProduct(req, res) {
    try {
        console.log('📥 Processing createProduct function'); // Debug

        const body = await getPostData(req);
        console.log(`📩 Received body: ${body}`); // Debug

        if (!body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Request body is empty' }));
        }

        const { name, description, price } = JSON.parse(body);
        if (!name || !description || !price) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Missing required fields' }));
        }

        const product = { name, description, price };
        const newProduct = await Product.create(product);

        console.log(`✅ Created new product: ${JSON.stringify(newProduct)}`); // Debug
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(newProduct));
    } catch (error) {
        console.log(`🚨 Error: ${error}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server Error' }));
    }
}


async function updateProduct(req, res, id) {
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Product Not Found' }));
        } else {
            const body = await getPostData(req);
            if (!body) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Request body is empty' }));
            }

            const { name, description, price } = JSON.parse(body);
            const productData = {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price
            };

            const updProduct = await Product.update(id, productData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(updProduct));
        }
    } catch (error) {
        console.log(error);
    }
}


async function deleteProduct(req, res, id) {
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Product Not Found' }));
        }

        await Product.remove(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: `Product ${id} removed` }));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
