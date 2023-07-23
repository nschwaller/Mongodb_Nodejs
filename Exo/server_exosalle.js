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

    /**
     * Affichez l’identifiant et le nom des salles qui sont des SMAC.
     */
    app.get('/smac', async function (req, res){
      const data = await db.collection('salles').find({smac:true}, { projection: {nom: true, _id:true }})
      res.json( await data.toArray() );
      });

      /**
       * Affichez le nom des salles qui possèdent une capacité d’accueil strictement supérieure à 1000 places.
       */
      app.get('/more1000', async function (req, res){
        const data = await db.collection('salles').find({ capacite: { $gt: 1000 } }, { projection: {nom: true }})
        res.json( await data.toArray() );
      });

      /**
       * Affichez l’identifiant des salles pour lesquelles le champ adresse ne comporte pas de numéro.
       */
      app.get('/nonumber', async function (req, res){
        const data = await db.collection('salles').find({ "adresse.numero": { $exists: false }  }, {projection: { _id: true }})
        res.json( await data.toArray() );
      });

      /**
       * Affichez l’identifiant puis le nom des salles qui ont exactement un avis.
       */
      app.get('/1avis', async function (req, res){
        const data = await db.collection('salles').aggregate([
          { $match: { avis: { $exists: true } } },
          { $match: { $expr: { $eq: [{ $size: "$avis" }, 1] } } },
          { $project: { _id: 1, nom: 1 } }
        ])
        res.json( await data.toArray() );
      });

      /**
       *  Affichez tous les styles musicaux des salles qui programment notamment du blues.
       */
      app.get('/bluesstyles', async function (req, res) {
        const data = await db.collection('salles').find({styles : "blues"}, {projection: { nom: true, styles : true }})
        res.json( await data.toArray());
      });

      /**
       * Affichez tous les styles musicaux des salles qui ont le style « blues » en première position dans leur tableau styles.
       */
      app.get('/bluesstylesfirst', async function (req, res) {
        const data = await db.collection('salles').find({
          $expr: {
            $eq: [{ $arrayElemAt: ['$styles', 0] }, 'blues']
          }}, 
          {projection: { nom: true, styles : true }})
        res.json( await data.toArray());
      });

      /**
       * Affichez la ville des salles dont le code postal commence par 84 et qui ont une capacité strictement inférieure à 500 places (pensez à utiliser une expression régulière).
       */
      app.get('/84and500', async function (req, res) {
        const data = await db.collection('salles').find({
          "adresse.codePostal": { $regex: /^84.*/ },
          capacite: { $lt: 500 }
        }, {projection: { "adresse.ville" : true, nom : true }})
        res.json( await data.toArray());
      });

      /**
       * Affichez l’identifiant pour les salles dont l’identifiant est pair ou le champ avis est absent.
       */
      app.get('/idpairornoavis', async function (req, res) {
        const data = await db.collection('salles').find({
          $or: [
            { _id: { $mod: [2, 0] } }, 
            { avis: { $exists: false } } 
          ]
        }, {projection: { _id : true }})
        res.json( await data.toArray());
      });


      /**
       * Affichez le nom des salles dont au moins un des avis comporte une note comprise entre 8 et 10 (tous deux inclus).
       */
      app.get('/avisbtw8and10', async function (req, res) {
        const data = await db.collection('salles').find({
          $or: [
            { _id: { $mod: [2, 0] } }, 
            { avis: { $exists: false } } 
          ]
        }, {projection: { nom : true }})
        res.json( await data.toArray());
      });
    
      /**
       * Affichez le nom des salles dont au moins un des avis comporte une date postérieure au 15/11/2019 (pensez à utiliser le type JavaScript Date).
       */
      app.get('/1avis15112019', async function (req, res) {
        const dateReference = new Date('2019-11-15');
        const data = await db.collection('salles').find({
          avis: {
            $elemMatch: {
              date: { $gt: dateReference }
            }
          }
        }, {projection: { nom : true }})
        res.json( await data.toArray());
      });
    
      /**
       * Affichez le nom ainsi que la capacité des salles dont le produit de la valeur de l’identifiant par 100 est strictement supérieur à la capacité.
       */
      app.get('/idby100', async function (req, res) {
        const data = await db.collection('salles').find({
          $expr: {
            $gt: [{ $multiply: ['$_id', 100] }, '$capacite']
          }
        }, {projection: { nom : true , capacite : true}})
        res.json( await data.toArray());
      });

      /**
       * Affichez le nom des salles de type SMAC programmant plus de deux styles de musiques différents en utilisant l’opérateur $where qui permet de faire usage de JavaScript.
       */
      app.get('/macmorethan2', async function (req, res) {
        const data = await db.collection('salles').find({
          smac:true,
          $where: function() {
            return this.styles.length > 2 && (new Set(this.styles)).size > 2; //optimiation a chier mais ok
          }
        }, {projection: { nom : true , capacite : true}})
        res.json( await data.toArray());
      });

      /**
       * Affichez les différents codes postaux présents dans les documents de la collection salles.
       */
      app.get('/zipcode', async function (req, res) {
        const data = await db.collection('salles').find({ "adresse.codePostal": { $exists: true }  }, {projection: {"adresse.codePostal" : true}})
        res.json( await data.toArray());
      });
      
      /**
       * Mettez à jour tous les documents de la collection salles en rajoutant 100 personnes à leur capacité actuelle.
       */
      app.put('/update100', async function (req, res) {
        const data = await db.collection('salles').updateMany({}, { $inc: { capacite: 100 } })
        res.json("updated");
      });

      /**
       * Ajoutez le style « jazz » à toutes les salles qui n’en programment pas.
       */
      app.put('/addjazz', async function (req, res) {
        const data = await db.collection('salles').updateMany(
        { styles: { $not: { $elemMatch: { $eq: "jazz" } } } },
        { $addToSet:{ "styles" : "jazz"} }
        )
        res.json("updated");
      });

      /**
       * Retirez le style «funk» à toutes les salles dont l’identifiant n’est égal ni à 2, ni à 3.
       */
      app.delete('/rmfunk23', async function (req, res) {
        const data = await db.collection('salles').updateMany(
        { _id: { $nin: [2, 3] } }  ,
        { $addToSet:{ "styles" : "jazz"} 
      })
        res.json("updated");
      });

      /**
       * Ajoutez un tableau composé des styles «techno» et « reggae » à la salle dont l’identifiant est 3.
       */
      app.put('/tekreaggae3', async function (req, res) {
        const data = await db.collection('salles').updateOne(
        { _id: 3 }  ,
        { $addToSet: { styles: { $each: ["techno", "reggae"] } },
        })
        res.json("updated");
      });

      /**
       * Pour les salles dont le nom commence par la lettre P (majuscule ou minuscule), augmentez la capacité de 150 places 
       * et rajoutez un champ de type tableau nommé contact dans lequel se trouvera un document comportant un champ nommé telephone dont la valeur sera « 04 11 94 00 10 ».
       */
      app.put('/p150', async function (req, res) {
        const data = await db.collection('salles').updateMany({ nom: { $regex: /^P/i }},
        { $inc: { capacite: 150 } ,    $set: { contact: [{ telephone :" 04 11 94 00 10 "} ] } } 
        )
        res.json("updated");
      });

      /**
       * Pour les salles dont le nom commence par une voyelle (peu importe la casse, là aussi), rajoutez dans le tableau avis un document composé du champ date valant la date 
       * courante et du champ note valant 10 (double ou entier). 
       * L’expression régulière pour chercher une chaîne de caractères débutant par une voyelle suivie de n’importe quoi d’autre est [^aeiou]+$.
       */
      app.put('/voyelle', async function (req, res) {
        const data = await db.collection('salles').updateMany({ nom: { $regex: /[^aeiou]+$/ }},
          { $push: { avis: avis } },  
        )
        res.json("updated");
      });

      /**
       * En mode upsert, vous mettrez à jour tous les documents dont le nom commence par un z ou un Z en leur affectant comme nom « Pub Z », 
       * comme valeur du champ capacite 50 personnes (type entier et non décimal) et en positionnant le champ booléen smac à la valeur « false ».
       */
      app.put('/z', async function (req, res) {
        const data = await db.collection('salles').updateMany( { nom: { $regex: /^[zZ]/ } },
        { $set:
          { 
            nom: "Pub Z",
            capacite: 50,
            smac: false
          },
          
        }, 
        { upsert: true },
        )
        res.json("updated");
      });

    /**
     * Affichez le décompte des documents pour lesquels le champ _id est de type « objectId ».
     */
    app.get('/objid',async function (req,res){
      const data = await db.collection('salles').find( { _id: { $type: 'objectId' } })
      res.json( (await data.toArray()));
    });

    /**
     * Pour les documents dont le champ _id n’est pas de type « objectId », affichez le nom de la salle ayant la plus grande capacité. Pour y parvenir, 
     * vous effectuerez un tri dans l’ordre qui convient tout en limitant le nombre de documents affichés pour ne retourner que celui qui comporte la capacité maximale.
     */
    app.get('/notobjid',async function (req,res){
      const data = await db.collection('salles').find( { _id: {$not : { $type: 'objectId' } }}).sort({ capacite: -1 }).limit(1)
      res.json( (await data.toArray()));
    });

    /**
     * Remplacez, sur la base de la valeur de son champ _id, le document créé à l’exercice 20 par un document contenant seulement le nom préexistant et la capacité, 
     * que vous monterez à 60 personnes.
     */
    app.put('/exo20update',async function (req,res){
      const data = await db.collection('salles').replaceOne({ _id: { $type: 'objectId' } },
      {
        nom: nom,
        capacite: 60
      } )
      res.json( "updated");
    });

    /**
     * Effectuez la suppression d’un seul document avec les critères suivants : le champ _id est de type « objectId » et la capacité de la salle est inférieure ou égale à 60 personnes.
     */
    app.delete('/objid60',async function (req,res){
      const data = await db.collection('salles').deleteOne(
        { _id: { $type: 'objectId' }, capacite: { $lte: 60 } })
      res.json("deleted");
    });

    // À l’aide de la méthode permettant de trouver un seul document et de le mettre à jour en même temps, réduisez de 15 personnes la capacité de la salle située à Nîmes.
    app.put('/nimesm15',async function (req,res){
      const data = await db.collection('salles').findOneAndUpdate(
        { "adresse.ville" : "Nîmes"}, { $inc: { capacite: -15 } },)
      res.json("updated");
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

