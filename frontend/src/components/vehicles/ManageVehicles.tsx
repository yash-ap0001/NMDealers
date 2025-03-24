import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

interface VehicleImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
  order: number;
}

interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyStyle: string;
  color: string;
  condition: string;
  status: string;
  images: VehicleImage[];
}

const ManageVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/vehicles');
      setVehicles(response.data.vehicles);
    } catch (err) {
      setError('Failed to load vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleDeleteImage = async (vehicleId: number, imageId: number) => {
    try {
      await axios.delete(`/vehicles/${vehicleId}/images/${imageId}`);
      fetchVehicles(); // Refresh the list
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`/vehicles/${vehicleId}`);
        fetchVehicles(); // Refresh the list
      } catch (err) {
        console.error('Error deleting vehicle:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    try {
      const formData = new FormData();
      // Append vehicle data
      Object.entries(editingVehicle).forEach(([key, value]) => {
        if (key !== 'images' && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Append new images
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.put(`/vehicles/${editingVehicle.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the vehicle in the list with the response data
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
          vehicle.id === editingVehicle.id ? response.data : vehicle
        )
      );

      setEditingVehicle(null);
      setNewImages([]);
      setPreviewImages([]);
    } catch (err) {
      console.error('Error updating vehicle:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Vehicles</h1>
            <p className="mt-2 text-sm text-gray-600">View and manage your vehicle listings</p>
          </div>
          <button
            onClick={() => navigate('/vehicles/create')}
            className="btn btn-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Vehicle
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new vehicle listing.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/vehicles/create')}
                className="btn btn-primary"
              >
                Add New Vehicle
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={vehicle.images[0]?.imageUrl || '/placeholder-vehicle.jpg'}
                    alt={vehicle.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{vehicle.title}</h3>
                  <p className="text-gray-600">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-xl font-bold text-blue-600 mt-2">
                    ${vehicle.price.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      vehicle.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </div>
                </div>

                {editingVehicle?.id === vehicle.id && (
                  <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={editingVehicle.title}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, title: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="number"
                          value={editingVehicle.price}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, price: Number(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={editingVehicle.description}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Add New Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                      {previewImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {previewImages.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVehicle(null);
                            setNewImages([]);
                            setPreviewImages([]);
                          }}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="p-4 border-t bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {vehicle.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.imageUrl}
                          alt={`Vehicle ${image.order + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          onClick={() => handleDeleteImage(vehicle.id, image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehicles; 