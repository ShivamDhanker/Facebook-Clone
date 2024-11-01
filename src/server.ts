import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import path from 'path';

connectDB();

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})