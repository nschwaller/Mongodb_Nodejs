import { Request, Response } from 'express';
import Car, { ICar } from '../models/Car';

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         make:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: number
 *         owner:
 *           $ref: '#/components/schemas/User'
 */





/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Crée une nouvelle voiture.
 *     tags: [Car]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Voiture créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Requête invalide (e.g., données manquantes).
 *       500:
 *         description: Erreur serveur.
 */
// POST - Créer une nouvelle voiture
export const createCar = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { make, model, year, ownerId } = req.body;
    const car: ICar = new Car({ make, model, year, owner: ownerId });
    await car.save();

    return res.status(201).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * tags:
 *   name: Car
 *   description: Opérations liées aux voitures
 * /api/cars:
 *   get:
 *     summary: Récupère toutes les voitures.
 *     tags: [Car]
 *     responses:
 *       200:
 *         description: Liste de toutes les voitures.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         description: Erreur serveur.
 */
// GET - Récupérer toutes les voitures
export const getAllCars = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const cars: ICar[] = await Car.find().populate('owner', 'email');
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/cars/{carId}:
 *   get:
 *     summary: Récupère une voiture par son ID.
 *     tags: [Car]
 *     parameters:
 *       - name: carId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la voiture à récupérer.
 *     responses:
 *       200:
 *         description: Voiture récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Voiture non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
// GET - Récupérer une voiture par son ID
export const getCarById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const carId: string = req.params.id;
    const car: ICar | null = await Car.findById(carId).populate('owner', 'email');

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/cars/{carId}:
 *   put:
 *     summary: Met à jour une voiture existante.
 *     tags: [Car]
 *     parameters:
 *       - name: carId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la voiture à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Voiture mise à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Requête invalide (e.g., données manquantes).
 *       404:
 *         description: Voiture non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
// PUT - Mettre à jour une voiture par son ID
export const updateCarById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const carId: string = req.params.id;
    const { make, model, year, ownerId } = req.body;
    const updatedCar: ICar | null = await Car.findByIdAndUpdate(
      carId,
      { make, model, year, owner: ownerId },
      { new: true }
    ).populate('owner', 'email');

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json(updatedCar);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @swagger
 * /api/cars/{carId}:
 *   delete:
 *     summary: Supprime une voiture existante.
 *     tags: [Car]
 *     parameters:
 *       - name: carId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la voiture à supprimer.
 *     responses:
 *       200:
 *         description: Voiture supprimée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Voiture non trouvée.
 *       500:
 *         description: Erreur serveur.
 */
// DELETE - Supprimer une voiture par son ID
export const deleteCarById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const carId: string = req.params.id;
    const deletedCar: ICar | null = await Car.findByIdAndDelete(carId).populate('owner', 'email');

    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};
