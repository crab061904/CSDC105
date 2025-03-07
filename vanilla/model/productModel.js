let products = require('../data/products');
const { writeDataToFile } = require('../utils');

function generateUniqueId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newId;
    
    do {
        newId = '';
        for (let i = 0; i < 10; i++) {
            newId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (products.some((product) => product.id === newId));

    return newId;
}

function findAll() {
    return new Promise((resolve) => {
        resolve(products);
    });
}

function findById(id) { // Fix: Add id parameter
    return new Promise((resolve) => {
        const product = products.find((p) => p.id === id);
        resolve(product);
    });
}

function create(product) {
    return new Promise((resolve) => {
        const newProduct = { id: generateUniqueId(), ...product };
        products.push(newProduct);
        writeDataToFile('./data/products.json', products);
        resolve(newProduct);
    });
}

function update(id, product) {
    return new Promise((resolve, reject) => {
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) reject('Product not found');
        
        products[index] = { id, ...product };
        writeDataToFile('./data/products.json', products);
        resolve(products[index]);
    });
}

function remove(id) {
    return new Promise((resolve) => {
        products = products.filter((p) => p.id !== id);
        writeDataToFile('./data/products.json', products);
        resolve();
    });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
