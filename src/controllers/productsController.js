const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const finalPrice = (p,d) => Math.round( p - (p*(d/100)))

const controller = {
	
	index: (req, res) => {
		res.render('products', {products, toThousand})
	},

	detail: (req, res) => {
		const {id} = req.params
		const productDetail = products.find(e => e.id === +id)
		res.render ('detail', {productDetail, toThousand, finalPrice})
	},

	// Create Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create  Method to store
	store: (req, res) => {
		const product = req.body
		product.id = products.length + 1
		products.push(product)
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
		res.redirect(`/products/detail/${product.id}`)
	},

	// Update Form to edit
	edit: (req, res) => {
		const productEdit = products.find(e => e.id === +req.params.id)
		res.render('product-edit-form', {productEdit})
	},
	// Update Method to update
	update: (req, res) => {
		const productUpdate = products.find(e => e.id === +req.params.id)
		const {name,price,discount,category,description,image} = req.body 
		if (productUpdate) {
			productUpdate.name = name
			productUpdate.price = +price
			productUpdate.discount = +discount
			productUpdate.category = category
			productUpdate.description = description
			fs.writeFileSync(productsFilePath, JSON.stringify(products))
			res.redirect(`/products/detail/${req.params.id}`)
		} else {
			res.redirect('/')
		}
	},

	destroy : (req, res) => {
		products = products.filter(p => p.id !== +req.params.id)
		fs.writeFileSync(productsFilePath, JSON.stringify(products))
		res.redirect('/')
	}
};

module.exports = controller;