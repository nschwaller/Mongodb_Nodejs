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

     // Route pour la mise en place de la base de données
     app.get('/setup',async function (req, res) {
      // Création de la collection "employees"
      db.createCollection("employees");

      // Insertion de plusieurs documents dans la collection "employees"
      db.collection('employees').insertMany([
        {
          name: "John Doe",
          age: 35,
          job: "Manager",
          salary: 80000
       },
       
       {
          name: "Jane Doe",
          age: 32,
          job: "Developer",
          salary: 75000
       },
       
       {
          name: "Jim Smith",
          age: 40,
          job: "Manager",
          salary: 85000
       }
      ], function (
        err,
        info
      ) {
        // En cas d'erreur, renvoie le statut d'erreur
        res.status(err.status).res.send(info)
      })
    })

    // Route pour la réinitialisation de la collection
    app.get('/reset', function (req, res) {
        // Suppression de la collection 'employees'
        db.dropCollection('employees')
        .then(
          res.status(200).res.send("reset")
        )
        .catch(
          res.status(500).res.send(res)
        )
     
    })

    /** 
    * Écrivez une requête MongoDB pour trouver tous les documents dans la collection "employees".
    */
    app.get('/all', async function (req, res){
      // Récupération de tous les documents dans la collection 'employees'
      const data = await db.collection('employees').find({})
      res.json( await data.toArray() );
    });




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
