import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(cookieParser());

// IMPORT PRODUCT ROUTERS
import productRouter from './Routers/productRouters';
import userRouter from './Routers/userRoutes';

app.use('/', productRouter);
app.use('/', userRouter);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve());
});

// IMPORTING ERRORS
import Error from './Middleware/Error';
app.use(Error);

export default app;
