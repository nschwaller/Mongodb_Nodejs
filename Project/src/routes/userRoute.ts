import express, { Request, Response } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
} from '../controllers/userController';

const router = express.Router();

// Route pour créer un nouvel utilisateur
router.post('/', createUser);

// Route pour récupérer tous les utilisateurs
router.get('/' , getAllUsers);

// Route pour récupérer un utilisateur par son ID
router.get('/:id', getUserById);

// Route pour mettre à jour un utilisateur par son ID
router.put('/:id', updateUserById);

// Route pour supprimer un utilisateur par son ID
router.delete('/:id', deleteUserById);

// Nouvelle route pour la connexion (login) de l'utilisateur
router.post('/login', loginUser);

export default router;
