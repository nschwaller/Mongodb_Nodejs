import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
} from '../controllers/carController';
import authenticateToken from '../middleware/authenticateToken'; 

const router = express.Router();

// Route pour créer une nouvelle voiture
router.post('/',authenticateToken, createCar);

// Route pour récupérer toutes les voitures
router.get('/', getAllCars);

// Route pour récupérer une voiture par son ID
router.get('/:id', getCarById);

// Route pour mettre à jour une voiture par son ID
router.put('/:id',authenticateToken, updateCarById);

// Route pour supprimer une voiture par son ID
router.delete('/:id',authenticateToken, deleteCarById);

export default router;
