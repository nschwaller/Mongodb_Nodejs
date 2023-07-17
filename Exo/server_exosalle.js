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
    // Route pour la mise en place de la base de données
    app.get('/setup',async function (req, res) {
      // Crée la collection "salles"
      db.createCollection("salles");
      db.collection('salles').insertMany([
          { 
              "_id": 1, 
              "nom": "AJMI Jazz Club", 
              "adresse": { 
                  "numero": 4, 
                  "voie": "Rue des Escaliers Sainte-Anne", 
                  "codePostal": "84000", 
                  "ville": "Avignon", 
                  "localisation": { 
                      "type": "Point", 
                      "coordinates": [43.951616, 4.808657] 
                  } 
              }, 
              "styles": ["jazz", "soul", "funk", "blues"], 
              "avis": [{ 
                      "date": new Date('2019-11-01'), 
                      "note": 8 
                  }, 
                  { 
                      "date": new Date('2019-11-30'), 
                      "note": 9
                  } 
              ], 
              "capacite": 300, 
              "smac": true 
          }, { 
              "_id": 2, 
              "nom": "Paloma", 
              "adresse": { 
                  "numero": 250, 
                  "voie": "Chemin de l'Aérodrome", 
                  "codePostal": "30000", 
                  "ville": "Nîmes", 
                  "localisation": { 
                      "type": "Point", 
                      "coordinates": [43.856430, 4.405415] 
                  } 
              }, 
              "avis": [{ 
                      "date": new Date('2019-07-06'), 
                      "note": 10 
                  } 
              ], 
              "capacite": 4000, 
              "smac": true 
          }, 
           { 
              "_id": 3, 
              "nom": "Sonograf", 
              "adresse": { 
                  "voie": "D901", 
                  "codePostal": "84250", 
                  "ville": "Le Thor", 
                  "localisation": { 
                      "type": "Point", 
                      "coordinates": [43.923005, 5.020077] 
                  } 
              }, 
              "capacite": 200, 
              "styles": ["blues", "rock"] 
          } 
      ], function (
        err,
        info
      ) {
        res.status(err.status).res.send(info)
      })
    })

     // Crée la route '/reset' qui supprime la collection "salles"
    app.get('/reset', function (req, res) {
        db.dropCollection('salles')
        .then(
          res.status(200).res.send("reset")
        )
        .catch(
          res.status(500).res.send("error")
        )
     
    })

    /**
     * Écrivez une requête MongoDB pour trouver tous les documents dans la collection "employees"
     */
    app.get('/all', async function (req, res){
    const data = await db.collection('employees').find({})
    res.json( await data.toArray() );
    });

     
     
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

