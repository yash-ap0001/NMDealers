import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';

interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: Array<{
    id: number;
    imageUrl: string;
    isMain: boolean;
  }>;
}

interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      if (searchTerm) params.append('search', searchTerm);
      if (selectedMake) params.append('make', selectedMake);

      const response = await axios.get<VehicleListResponse>(`/vehicles?${params.toString()}`);
      setVehicles(response.data.vehicles);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchTerm, selectedMake]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleMakeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(event.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Available Vehicles</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search vehicles..."
            className="input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select 
            className="input"
            value={selectedMake}
            onChange={handleMakeChange}
          >
            <option value="">All Makes</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
          </select>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No vehicles found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              to={`/vehicles/${vehicle.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={vehicle.images?.find(img => img.isMain)?.imageUrl || '/placeholder-vehicle.jpg'}
                    alt={vehicle.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                    {vehicle.title}
                  </h2>
                  <p className="text-gray-600">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="mt-2 text-lg font-bold text-blue-600">
                    ${vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleList; 