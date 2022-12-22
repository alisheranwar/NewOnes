import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'Please Enter Product Name'] },
		price: { type: String, required: [true, 'Please Enter Product Price'] },
		description: {
			type: String,
			required: [true, 'Please Enter Product Description'],
		},
		images: [
			{
				url: {
					type: String,
					required: true,
				},
			},
		],
		category: {
			type: String,
			required: [true, 'Please Enter Product Category'],
		},
		Stock: { type: Number, required: true, default: 1 },

		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'user',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const productModel = mongoose.model('Products', productSchema);

export default productModel;
