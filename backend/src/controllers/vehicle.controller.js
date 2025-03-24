import { Vehicle, VehicleImage } from '../models/associations.js';
import { createActivity } from './activity.controller.js';
import { Op } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';

// Create a new vehicle listing
export const createVehicle = async (req, res) => {
  try {
    // Create vehicle
    const vehicle = await Vehicle.create({
      ...req.body,
      dealerId: req.dealer.id,
      status: 'active' // Set default status
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        vehicleId: vehicle.id,
        imageUrl: `/uploads/${file.filename}`,
        isMain: index === 0,
        order: index
      }));

      await VehicleImage.bulkCreate(images);
    }

    // Create activity
    await createActivity(
      req.dealer.id,
      'vehicle',
      `Added new vehicle: ${vehicle.make} ${vehicle.model} ${vehicle.year}`
    );

    // Fetch vehicle with images
    const vehicleWithImages = await Vehicle.findByPk(vehicle.id, {
      include: [{
        model: VehicleImage,
        as: 'images'
      }]
    });

    res.status(201).json(vehicleWithImages);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all vehicles with filtering and pagination
export const getVehicles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      make,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuelType,
      transmission,
      condition,
      status = 'active' // Default to active vehicles
    } = req.query;

    // Build where clause
    const where = { status };

    // Handle search
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { make: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Handle filters
    if (make) where.make = make;
    if (model) where.model = model;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year[Op.gte] = minYear;
      if (maxYear) where.year[Op.lte] = maxYear;
    }
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (condition) where.condition = condition;

    // Get vehicles
    const vehicles = await Vehicle.findAndCountAll({
      where,
      include: [{
        model: VehicleImage,
        as: 'images',
        required: false
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      distinct: true // This ensures correct count with included models
    });

    // Format response
    const formattedVehicles = vehicles.rows.map(vehicle => {
      const plainVehicle = vehicle.get({ plain: true });
      return {
        ...plainVehicle,
        images: plainVehicle.images.map(img => ({
          ...img,
          imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}${img.imageUrl}`
        }))
      };
    });

    res.json({
      vehicles: formattedVehicles,
      total: vehicles.count,
      totalPages: Math.ceil(vehicles.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [{
        model: VehicleImage,
        as: 'images'
      }]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Format the response to include full image URLs
    const plainVehicle = vehicle.get({ plain: true });
    const formattedVehicle = {
      ...plainVehicle,
      images: plainVehicle.images.map(img => ({
        ...img,
        imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}${img.imageUrl}`
      }))
    };

    res.json(formattedVehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        dealerId: req.dealer.id
      }
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update vehicle fields
    await vehicle.update(req.body);

    // Handle new images if any
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        vehicleId: vehicle.id,
        imageUrl: `/uploads/${file.filename}`,
        isMain: false,
        order: index
      }));

      await VehicleImage.bulkCreate(images);
    }

    // Create activity
    await createActivity(
      req.dealer.id,
      'vehicle',
      `Updated vehicle: ${vehicle.make} ${vehicle.model} ${vehicle.year}`
    );

    // Fetch updated vehicle with images
    const updatedVehicle = await Vehicle.findByPk(vehicle.id, {
      include: [{
        model: VehicleImage,
        as: 'images'
      }]
    });

    // Format the response to include full image URLs
    const plainVehicle = updatedVehicle.get({ plain: true });
    const formattedVehicle = {
      ...plainVehicle,
      images: plainVehicle.images.map(img => ({
        ...img,
        imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}${img.imageUrl}`
      }))
    };

    res.json(formattedVehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        dealerId: req.dealer.id
      },
      include: [{
        model: VehicleImage,
        as: 'images'
      }]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete image files
    for (const image of vehicle.images) {
      const imagePath = path.join(process.cwd(), 'uploads', path.basename(image.imageUrl));
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Delete vehicle (will cascade delete images)
    await vehicle.destroy();

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update vehicle images
export const updateVehicleImages = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        dealerId: req.dealer.id
      }
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const images = req.files.map((file, index) => ({
      vehicleId: vehicle.id,
      imageUrl: `/uploads/${file.filename}`,
      isMain: index === 0,
      order: index
    }));

    await VehicleImage.bulkCreate(images);

    const updatedVehicle = await Vehicle.findByPk(vehicle.id, {
      include: [{
        model: VehicleImage,
        as: 'images'
      }]
    });

    res.json(updatedVehicle);
  } catch (error) {
    console.error('Update vehicle images error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete vehicle image
export const deleteVehicleImage = async (req, res) => {
  try {
    const image = await VehicleImage.findOne({
      where: {
        id: req.params.imageId,
        vehicleId: req.params.vehicleId
      },
      include: [{
        model: Vehicle,
        as: 'vehicle',
        where: { dealerId: req.dealer.id }
      }]
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete image file
    const imagePath = path.join(process.cwd(), 'uploads', path.basename(image.imageUrl));
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      console.error('Error deleting image file:', error);
    }

    await image.destroy();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 