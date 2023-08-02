import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import User, { IUser } from '../models/User';


// Fonction pour vérifier si un email est valide
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex
  return emailRegex.test(email);
};


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 */



/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connecte un utilisateur existant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides.
 *       500:
 *         description: Erreur serveur.
 */
// POST - Connexion (login) de l'utilisateur
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Création d'un token JWT avec l'ID de l'utilisateur comme payload
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/users/:
 *   post:
 *     tags: [User]
 *     summary: Crée un nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Requête invalide (e.g., email invalide, mot de passe trop court).
 *       409:
 *         description: Un utilisateur avec cet email existe déjà.
 *       500:
 *         description: Erreur serveur.
 */

// POST - Créer un nouvel utilisateur
export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier si l'utilisateur avec cet email existe déjà
    const existingUser: IUser | null = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Chiffrer le mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new User({ email, password: hashedPassword });
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Opérations liées aux utilisateurs
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé (jeton invalide ou expiré).
 *       500:
 *         description: Erreur serveur.
 */
// GET - Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users: IUser[] = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Récupère un utilisateur par son ID.
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à récupérer.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé (jeton invalide ou expiré).
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
// GET - Récupérer un utilisateur par son ID
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId: string = req.params.id;
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     tags: [User]
 *     summary: Met à jour un utilisateur existant.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide (e.g., email invalide).
 *       401:
 *         description: Non autorisé (jeton invalide ou expiré).
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
// PUT - Mettre à jour un utilisateur par son ID
export const updateUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId: string = req.params.id;
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }
    
    const updatedUser: IUser | null = await User.findByIdAndUpdate(userId, { email }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     tags: [User]
 *     summary: Supprime un utilisateur existant.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à supprimer.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé (jeton invalide ou expiré).
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
// DELETE - Supprimer un utilisateur par son ID
export const deleteUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId: string = req.params.id;
    const deletedUser: IUser | null = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};