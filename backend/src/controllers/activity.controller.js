import { Activity, Vehicle } from '../models/associations.js';

// Get recent activities for a dealer
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { dealerId: req.dealer.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new activity
export const createActivity = async (dealerId, type, description) => {
  try {
    await Activity.create({
      dealerId,
      type,
      description
    });
  } catch (error) {
    console.error('Create activity error:', error);
  }
}; 