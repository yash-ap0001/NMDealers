import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, Control } from 'react-hook-form';
import axios from '../../config/axios';
import RichTextEditor from '../common/RichTextEditor';
import VehiclePreview from './VehiclePreview';

export interface VehicleFormData {
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
  images: File[];
}

interface FieldProps {
  field: {
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string) => void;
    value: any;
    name: string;
  };
}

const initialFormData: VehicleFormData = {
  title: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  description: '',
  mileage: 0,
  fuelType: 'Petrol',
  transmission: 'Automatic',
  bodyStyle: 'Sedan',
  color: '',
  condition: 'Used',
  images: [],
};

const VehicleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VehicleFormData>({
    defaultValues: initialFormData,
  });

  useEffect(() => {
    if (id) {
      fetchVehicleData();
    }
  }, [id]);

  const fetchVehicleData = async () => {
    try {
      const response = await axios.get(`/vehicles/${id}`);
      const vehicle = response.data;
      reset({
        ...vehicle,
        images: [], // We'll handle images separately
      });
    } catch (err) {
      setError('Failed to load vehicle data');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setValue('images', newImages);
      
      // Create preview URLs for the images
      const previewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewImages(previewUrls);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: VehicleFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle images separately
          data.images.forEach((file, index) => {
            if (file) {
              formDataToSend.append(`images`, file);
            }
          });
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      if (id) {
        await axios.put(`/vehicles/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/vehicles', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Preview
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" role="form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="text"
                  id="title"
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="make" className="label">Make</label>
            <Controller
              name="make"
              control={control}
              rules={{ required: 'Make is required' }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="text"
                  id="make"
                  className={`input ${errors.make ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.make && (
              <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="model" className="label">Model</label>
            <Controller
              name="model"
              control={control}
              rules={{ required: 'Model is required' }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="text"
                  id="model"
                  className={`input ${errors.model ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="year" className="label">Year</label>
            <Controller
              name="year"
              control={control}
              rules={{
                required: 'Year is required',
                min: { value: 1900, message: 'Year must be after 1900' },
                max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
              }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="number"
                  id="year"
                  className={`input ${errors.year ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="label">Price</label>
            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Price is required',
                min: { value: 0, message: 'Price cannot be negative' }
              }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="number"
                  id="price"
                  className={`input ${errors.price ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="mileage" className="label">Mileage (km)</label>
            <Controller
              name="mileage"
              control={control}
              rules={{
                required: 'Mileage is required',
                min: { value: 0, message: 'Mileage cannot be negative' }
              }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="number"
                  id="mileage"
                  className={`input ${errors.mileage ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.mileage && (
              <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fuelType" className="label">Fuel Type</label>
            <Controller
              name="fuelType"
              control={control}
              rules={{ required: 'Fuel type is required' }}
              render={({ field }: FieldProps) => (
                <select
                  {...field}
                  id="fuelType"
                  className={`input ${errors.fuelType ? 'border-red-500' : ''}`}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              )}
            />
            {errors.fuelType && (
              <p className="mt-1 text-sm text-red-600">{errors.fuelType.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="transmission" className="label">Transmission</label>
            <Controller
              name="transmission"
              control={control}
              rules={{ required: 'Transmission is required' }}
              render={({ field }: FieldProps) => (
                <select
                  {...field}
                  id="transmission"
                  className={`input ${errors.transmission ? 'border-red-500' : ''}`}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              )}
            />
            {errors.transmission && (
              <p className="mt-1 text-sm text-red-600">{errors.transmission.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bodyStyle" className="label">Body Style</label>
            <Controller
              name="bodyStyle"
              control={control}
              rules={{ required: 'Body style is required' }}
              render={({ field }: FieldProps) => (
                <select
                  {...field}
                  id="bodyStyle"
                  className={`input ${errors.bodyStyle ? 'border-red-500' : ''}`}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Van">Van</option>
                </select>
              )}
            />
            {errors.bodyStyle && (
              <p className="mt-1 text-sm text-red-600">{errors.bodyStyle.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="color" className="label">Color</label>
            <Controller
              name="color"
              control={control}
              rules={{ required: 'Color is required' }}
              render={({ field }: FieldProps) => (
                <input
                  {...field}
                  type="text"
                  id="color"
                  className={`input ${errors.color ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="condition" className="label">Condition</label>
            <Controller
              name="condition"
              control={control}
              rules={{ required: 'Condition is required' }}
              render={({ field }: FieldProps) => (
                <select
                  {...field}
                  id="condition"
                  className={`input ${errors.condition ? 'border-red-500' : ''}`}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              )}
            />
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }: FieldProps) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                error={!!errors.description}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Vehicle Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            data-testid="image-upload"
            onChange={handleImageChange}
            className={`mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              ${errors.images ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Preview Vehicle Listing</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <VehiclePreview data={watch()} images={previewImages} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleForm; 