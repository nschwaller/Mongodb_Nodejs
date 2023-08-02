import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config(); 

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Récupère le token depuis le header "Authorization"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Vérifie la validité du token JWT
  jwt.verify(token, 'your-secret-key' , (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Si le token est valide, on ajoute les informations d'identification de l'utilisateur dans la requête
    req.body.user = user;

    next(); // Appel de la prochaine fonction du middleware
  });
};

export default authenticateToken;
