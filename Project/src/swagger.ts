import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API vago',
      version: '1.0.0',
      description: 'Api de gestion de voitures',
    },
    servers: [
      {
        url: 'http://127.0.0.1:3000', // Remplacez cette URL par l'URL de votre serveur
      },
    ],
  },
  apis: ['./controllers/*'], // Chemin vers vos fichiers de contrôleurs avec les commentaires JSDoc
};

const specs = swaggerJsDoc(options);
export default specs;