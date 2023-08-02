import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
} from '../controllers/carController';

const router = express.Router();

// Route pour créer une nouvelle voiture
router.post('/', createCar);

// Route pour récupérer toutes les voitures
router.get('/', getAllCars);

// Route pour récupérer une voiture par son ID
router.get('/:id', getCarById);

// Route pour mettre à jour une voiture par son ID
router.put('/:id', updateCarById);

// Route pour supprimer une voiture par son ID
router.delete('/:id', deleteCarById);

export default router;
