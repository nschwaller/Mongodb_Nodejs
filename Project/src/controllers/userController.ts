import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import User, { IUser } from '../models/User';


// Fonction pour vérifier si un email est valide
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex
  return emailRegex.test(email);
};


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


// GET - Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users: IUser[] = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};


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