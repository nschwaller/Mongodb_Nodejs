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


    /**
     * Écrivez une requête pour trouver tous les documents où l'âge est supérieur à 33.
     */
    app.get('/allgt33', async function (req, res){
      // Récupération des documents où l'âge est supérieur à 33
      const data = await db.collection('employees').find({"age": { $gt: 33 }})
      res.json( await data.toArray() );
    });


    /**
     * Écrivez une requête pour trier les documents dans la collection "employees" par salaire décroissant.
     */
    app.get('/allsalarydesc', async function (req, res){
      // Tri des documents par salaire décroissant
      const data = await db.collection('employees').find({}).sort({"salary" : -1})
      res.json( await data.toArray() );
    });

    /**
     * Écrivez une requête pour sélectionner uniquement le nom et le job de chaque document.
     */
    app.get('/allonlynameandjob', async function (req, res){
      // Récupération du nom et du poste pour chaque document
      const data = await db.collection('employees').find({}, { projection: {nom: true, job : true}})
      res.json( await data.toArray() );
    });

    /**
     * Écrivez une requête pour compter le nombre d'employés par poste.
     */
    app.get('/countbyjob', async function (req, res){
      // Grouper par poste et compter le nombre d'employés
      const data = await 
      db.collection('employees').aggregate([
        {
          $group: {
            _id: "$job",
            totalEmployees: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            job: "$_id",
            totalEmployees: 1
          }
        }
      ])
      res.json( await data.toArray() );
    });

    /**
     * Écrivez une requête pour mettre à jour le salaire de tous les développeurs à 80000.
     */
    app.put('/updatedevsalaries',async function (req,res) {
      // Mise à jour des salaires pour tous les développeurs
      const data = await 
      db.collection('employees').updateMany(
        { job: "Developer" },
        { $set: { salary: 80000 } }
      )
      res.json("updated to ");
    })

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
