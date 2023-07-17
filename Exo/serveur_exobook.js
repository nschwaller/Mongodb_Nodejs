// Importation des modules Express et MongoDB
const express = require('express');
const { MongoClient } = require('mongodb');

// Création d'une nouvelle application Express
const app = express();
const port = 3000;

// URL de connexion à MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'sample_db';

// Connexion à MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);


     /**
     * FONCTION DE L'API
     */





    // Démarrage du serveur
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    // En cas d'échec de la connexion à MongoDB, log l'erreur et termine le processus
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
