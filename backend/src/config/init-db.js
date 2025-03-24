import sequelize from './database.js';
import { Dealer, Vehicle, VehicleImage } from '../models/associations.js';

const initDatabase = async () => {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');

    // Create a default dealer for testing
    const defaultDealer = await Dealer.create({
      name: 'Test Dealer',
      email: 'test@example.com',
      password: 'password123',
      companyName: 'Test Company',
      phone: '1234567890',
      address: '123 Test St',
      isVerified: true,
      status: 'active'
    });

    console.log('Default dealer created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initDatabase();

export default initDatabase; 