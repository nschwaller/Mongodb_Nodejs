import 'tsconfig-paths/register';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import carRoute from './routes/carRoute';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

const app = express();

// Connexion à MongoDB à l'aide de Mongoose
const mongoURI = 'mongodb://127.0.0.1:27017/crud';
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', (error) => console.error('Erreur de connexion à MongoDB:', error));
db.once('open', () => console.log('Connecté à MongoDB !'));

// Définition de la route racine
app.use(express.json());

// Définit le chemin du fichier de log
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const logFilePath = path.join(logDirectory, 'api.log');
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Bonjour, ceci est une application de base Node.js avec une connexion à MongoDB à l\'aide de Mongoose.');
});
app.use('/api/users', userRoute);
app.use('/api/car', carRoute);


// Démarrage du serveur
const port = 3000; // Choisissez le port de votre choix
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

export default app;