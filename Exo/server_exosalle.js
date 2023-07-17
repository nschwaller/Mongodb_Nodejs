// Importation des modules Express et MongoDB
const express = require('express');
const { MongoClient } = require('mongodb');

// Création d'une nouvelle application Express
const app = express();
const port = 3000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'salles_db';

// URL de connexion à MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);


     /**
     * FONCTION DE L'API
     */

     
     
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

