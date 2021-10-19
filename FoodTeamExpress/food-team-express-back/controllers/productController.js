import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Buscar todos los productos
// @route   GET /api/products
// @acceso  Publico
const getProducts = asyncHandler(async(req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex : req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize)})
})

// @desc    Buscar un producto
// @route   GET /api/products/:id
// @acceso  Publico
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)

        if(product) {
            res.json(product)
        } else {
            res.status(404)
            throw new Error('Product not found')
        }
})

// @desc    Borrar un producto
// @route   DELETE /api/products/:id
// @acceso  Privado/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)

        if(product) {
            await product.remove()
            res.json({ message: 'Product removed' })
        } else {
            res.status(404)
            throw new Error('Product not found')
        }
})

// @desc    Crear un producto
// @route   POST /api/products
// @acceso  Privado/Admin
const createProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sampple category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @acceso  Privado/Admin
const updateProduct = asyncHandler(async(req, res) => {
    const {
        name, 
        price, 
        description, 
        image, 
        brand, 
        category, 
        countInStock} = req.body
    
    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock


        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }

})

// @desc    Crear nueva opinion
// @route   POST /api/products/:id/reviews
// @acceso  Privado/Admin
const createProductReview = asyncHandler(async(req, res) => {
    const { rating, comment } = req.body
    
    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewd = product.reviews.find(r => r.user.toString() === req.user._id.toString())
            if(alreadyReviewd) {
                res.status(400)
                throw new Error('Product already reviewd')
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            }

            product.reviews.push(review)

            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)
            / product.reviews.length
            
            await product.save()
            res.status(201).json({ message: 'Review added' })
            } else {
                res.status(404)
                throw new Error('Product not found')
            }

})

// @desc    Obtener los productos mas rankeados
// @route   GET /api/products/top
// @acceso  Publico
const getTopProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({}).sort({ rating: - 1 }).limit(3)

    res.json(products)
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }