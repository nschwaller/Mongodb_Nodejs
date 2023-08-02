import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  make: string;
  model: string;
  year: number;
  owner: mongoose.Types.ObjectId; 
}

const CarSchema: Schema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Référence au schéma User
});

export default mongoose.model<ICar>('Car', CarSchema);
