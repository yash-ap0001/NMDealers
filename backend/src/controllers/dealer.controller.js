import { Dealer } from '../models/associations.js';
import { generateToken } from '../middleware/auth.js';

// Register a new dealer
export const register = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ where: { email } });
    if (existingDealer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new dealer
    const dealer = await Dealer.create(req.body);
    
    // Generate token
    const token = generateToken(dealer);
    
    // Remove password from response
    const { password, ...dealerData } = dealer.toJSON();
    
    res.status(201).json({ ...dealerData, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login dealer
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find dealer
    const dealer = await Dealer.findOne({ where: { email } });
    if (!dealer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await dealer.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(dealer);

    // Remove password from response
    const { password: _, ...dealerData } = dealer.toJSON();
    
    res.json({ ...dealerData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get dealer profile
export const getProfile = async (req, res) => {
  try {
    const { password, ...dealerData } = req.dealer.toJSON();
    res.json(dealerData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update dealer profile
export const updateProfile = async (req, res) => {
  try {
    const dealer = req.dealer;
    
    // Update fields
    const updatableFields = ['name', 'companyName', 'phone', 'address'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        dealer[field] = req.body[field];
      }
    });

    await dealer.save();

    // Remove password from response
    const { password, ...dealerData } = dealer.toJSON();
    
    res.json(dealerData);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 