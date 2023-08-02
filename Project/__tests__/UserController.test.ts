import request from 'supertest';
import app from '../src/app';
import User, { IUser } from '../src/models/User';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import '@types/jest';

describe('UserController', () => {
  let jwt_secret = 'your-secret-key';
  let token: string // Variable pour stocker le token JWT

  beforeAll(async () => {
    // Connectez-vous à une base de données de test
    const MONGO_URI = 'mongodb://127.0.0.1:27017/crud';
    await mongoose.connect(MONGO_URI);
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Déconnectez-vous de la base de données de test
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const user = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    token = jwt.sign({ email: user.email }, jwt_secret as string, { expiresIn: '1h' });
    const response = await request(app).post('/api/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe(user.email);
  });

  it('should not create a new user with duplicate email', async () => {
    const user = {
        email: 'test@example.com',
        password: 'testpassword',
      };  

    const response = await request(app).post('/api/users').send(user);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User already exists with this email');
  });

  it('should login a user and return a JWT token', async () => {
   const user = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/users/login').send({
      email: user.email,
      password: 'testpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });





  
  it('should update a user', async () => {
    const existingUser: IUser = new User({
      email: 'test2@example.com',
      password: 'testpassword',
    });
    await existingUser.save();

    const updatedUser = {
      email: 'updated@example.com',
      password: 'updatedpassword',
    };

    const response = await request(app)
      .put(`/api/users/${existingUser._id}`)
      .set('Authorization', `Bearer ${token}`) // Inclure le token JWT dans l'en-tête
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', existingUser._id.toString());
    expect(response.body.email).toBe(updatedUser.email);

    const updatedUserFromDB = await User.findById(existingUser._id);
    expect(updatedUserFromDB?.email).toBe(updatedUser.email);
  });

  it('should delete a user', async () => {
    const existingUser: IUser = new User({
      email: 'test3@example.com',
      password: 'testpassword',
    });
    await existingUser.save();

    const response = await request(app)
      .delete(`/api/users/${existingUser._id}`)
      .set('Authorization', `Bearer ${token}`); // Inclure le token JWT dans l'en-tête

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');

    const deletedUserFromDB = await User.findById(existingUser._id);
    expect(deletedUserFromDB).toBeNull();
  });
});
