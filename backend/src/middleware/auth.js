import { Dealer } from '../models/associations.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (dealer) => {
  return jwt.sign(
    { id: dealer.id, email: dealer.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    // Get token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find dealer
    const dealer = await Dealer.findByPk(decoded.id);
    if (!dealer) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach dealer to request
    req.dealer = dealer;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}; 