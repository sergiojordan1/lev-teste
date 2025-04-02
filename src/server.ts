import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import contractRoutes from './routes/contractRoutes';
import connectDB from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/contracts', contractRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor backend rodando na porta ${port}`);
  });
});