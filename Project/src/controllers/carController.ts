import { Request, Response } from 'express';
import Car, { ICar } from '../models/Car';

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

// GET - Récupérer toutes les voitures
export const getAllCars = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const cars: ICar[] = await Car.find().populate('owner', 'email');
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

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
