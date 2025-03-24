import React from 'react';
import { VehicleFormData } from './VehicleForm';

interface VehiclePreviewProps {
  data: VehicleFormData;
  images: string[];
}

const VehiclePreview: React.FC<VehiclePreviewProps> = ({ data, images }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-96">
        {images.length > 0 ? (
          <div className="relative h-full">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${data.title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {images.length} images
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No images</span>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
        <p className="text-2xl font-semibold text-primary-600 mb-4">
          {formatPrice(data.price)}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <span className="text-gray-500">Make</span>
            <p className="font-medium">{data.make}</p>
          </div>
          <div>
            <span className="text-gray-500">Model</span>
            <p className="font-medium">{data.model}</p>
          </div>
          <div>
            <span className="text-gray-500">Year</span>
            <p className="font-medium">{data.year}</p>
          </div>
          <div>
            <span className="text-gray-500">Mileage</span>
            <p className="font-medium">{formatMileage(data.mileage)} km</p>
          </div>
          <div>
            <span className="text-gray-500">Fuel Type</span>
            <p className="font-medium">{data.fuelType}</p>
          </div>
          <div>
            <span className="text-gray-500">Transmission</span>
            <p className="font-medium">{data.transmission}</p>
          </div>
          <div>
            <span className="text-gray-500">Body Style</span>
            <p className="font-medium">{data.bodyStyle}</p>
          </div>
          <div>
            <span className="text-gray-500">Color</span>
            <p className="font-medium">{data.color}</p>
          </div>
          <div>
            <span className="text-gray-500">Condition</span>
            <p className="font-medium">{data.condition}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div 
            className="prose max-w-none"
            data-testid="vehicle-description"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default VehiclePreview; 