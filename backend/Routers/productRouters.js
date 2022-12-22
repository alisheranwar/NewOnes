import express from 'express';
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
} from '../Controllers/productController';
import { isAuthenticated, authorizeRoles } from '../Middleware/Authenticated';

const router = express.Router();

router
	.route('/creates')
	.post(isAuthenticated, authorizeRoles('admin'), createProduct);
router.route('/products').get(getAllProducts);
router
	.route('/product/:id')
	.get(getSingleProduct)
	.put(isAuthenticated, authorizeRoles('admin'), updateProduct)
	.delete(isAuthenticated, authorizeRoles('admin'), deleteProduct);

export default router;
