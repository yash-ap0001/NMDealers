import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../config/axios';

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
  images: VehicleImage[];
}

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Vehicle>(`/vehicles/${id}`);
        setVehicle(response.data);
        // Set the main image as selected by default
        const mainImage = response.data.images.find(img => img.isMain);
        if (mainImage) {
          setSelectedImage(mainImage.imageUrl);
        }
      } catch (err) {
        setError('Failed to load vehicle details');
        console.error('Error fetching vehicle:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Vehicle not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={selectedImage || vehicle.images[0]?.imageUrl || '/placeholder-vehicle.jpg'}
              alt={vehicle.title}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          {vehicle.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {vehicle.images.map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt={`${vehicle.title} - View ${image.order + 1}`}
                  className={`object-cover w-full h-24 rounded-lg cursor-pointer hover:opacity-75 transition-opacity ${
                    selectedImage === image.imageUrl ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedImage(image.imageUrl)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{vehicle.title}</h1>
          <p className="mt-2 text-xl text-gray-600">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <p className="mt-4 text-3xl font-bold text-blue-600">
            ${vehicle.price.toLocaleString()}
          </p>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{vehicle.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                <dd className="mt-1 text-sm text-gray-900">{vehicle.mileage.toLocaleString()} km</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{vehicle.fuelType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Transmission</dt>
                <dd className="mt-1 text-sm text-gray-900">{vehicle.transmission}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Body Style</dt>
                <dd className="mt-1 text-sm text-gray-900">{vehicle.bodyStyle}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Color</dt>
                <dd className="mt-1 text-sm text-gray-900">{vehicle.color}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Condition</dt>
                <dd className="mt-1 text-sm text-gray-900">{vehicle.condition}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8">
            <button className="btn btn-primary w-full">
              Contact Dealer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail; 