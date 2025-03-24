import Dealer from './Dealer.js';
import Vehicle from './Vehicle.js';
import VehicleImage from './VehicleImage.js';
import Activity from './Activity.js';

// Dealer - Vehicle associations
Dealer.hasMany(Vehicle, {
  foreignKey: 'dealerId',
  as: 'vehicles'
});

Vehicle.belongsTo(Dealer, {
  foreignKey: 'dealerId',
  as: 'dealer'
});

// Vehicle - VehicleImage associations
Vehicle.hasMany(VehicleImage, {
  foreignKey: 'vehicleId',
  as: 'images',
  onDelete: 'CASCADE'
});

VehicleImage.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle'
});

// Dealer - Activity associations
Dealer.hasMany(Activity, {
  foreignKey: 'dealerId',
  as: 'activities'
});

Activity.belongsTo(Dealer, {
  foreignKey: 'dealerId',
  as: 'dealer'
});

export { Dealer, Vehicle, VehicleImage, Activity }; 