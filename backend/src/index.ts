import express, { type Application } from 'express';
import cors from 'cors';
import routes from './routes'

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3001']
}))
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is operating live at http://localhost:${PORT}`);
});
