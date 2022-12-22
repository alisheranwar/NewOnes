import CatchAsyncError from '../Middleware/CatchAsyncError';
import Products from '../Models/productModel';
import ApiFeatures from '../Utils/ApiFeatures';
import ErrorHandler from '../Utils/ErrorHandler';

// Getting All Products
export const getAllProducts = CatchAsyncError(async (req, res, next) => {
	const resultPerPage = 10;
	const productCount = await Products.countDocuments();

	const apiFeatures = new ApiFeatures(Products.find(), req.query)
		.search()
		.filter()
		.pagination(resultPerPage);
	const products = await apiFeatures.query;
	if (!products) {
		return next(new ErrorHandler('Product Not Found', 404));
	}

	res.status(200).json({ success: true, products, productCount });
});

// Creating Product

export const createProduct = CatchAsyncError(async (req, res, next) => {
	req.body.user = req.user.id;
	const product = await Products.create(req.body);

	res
		.status(200)
		.json({ success: true, message: 'Product Created Successfully', product });
});

// Getting a single Product
export const getSingleProduct = CatchAsyncError(async (req, res, next) => {
	const product = await Products.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product Not Found', 404));
	}

	res.status(200).json({ success: true, product });
});

// UPDATING A PRODUCT

export const updateProduct = CatchAsyncError(async (req, res, next) => {
	let product = await Products.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product Not Found', 404));
	}

	product = await Products.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res
		.status(200)
		.json({ success: true, message: 'Product Updated Successfully', product });
});

// Delete A PRODUCT

export const deleteProduct = CatchAsyncError(async (req, res, next) => {
	const product = await Products.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler('Product Not Found', 404));
	}

	await product.remove();

	res
		.status(200)
		.json({ success: true, message: 'Product Deleted Successfully' });
});
