import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import healthHandler from '../api/health.js';

const app = express();
const port = Number(process.env.API_PORT) || 3001;

app.use(cors());
app.use(express.json());

app.all('/api/health', (req, res) => healthHandler(req, res));

app.listen(port, () => {
  console.log(`Dev API listening on http://localhost:${port}`);
});
