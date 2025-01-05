import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
app.use(express.json());
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import { nanoid } from 'nanoid';

// routers
import PatientRouter from './routes/PatientRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import PostureRouter from './routes/PostureRouter.js';
import DoctorRouter from './routes/DoctorRouter.js';
import PostRouter from "./routes/PostRouter.js";

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(path.resolve(__dirname, './public')));

// cloudinary
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/allusers', authenticateUser, PatientRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/postures', authenticateUser, PostureRouter);
app.use('/api/v1/MPersonnel', authenticateUser, DoctorRouter);
app.use("/api/v1/posts", authenticateUser, PostRouter);

// ไม่พบข้อมูล
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Not Found' });
});

// error
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
