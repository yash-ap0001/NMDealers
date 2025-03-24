import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  price: number
  imageUrl: string
  mileage: number
  transmission: string
  fuelType: string
}

interface Filters {
  make: string
  minPrice: number
  maxPrice: number
  minYear: number
  maxYear: number
}

const VehicleList = () => {
  const [filters, setFilters] = useState<Filters>({
    make: '',
    minPrice: 0,
    maxPrice: 1000000,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
  })

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>(
    ['vehicles', filters],
    async () => {
      const response = await axios.get('/api/vehicles', { params: filters })
      return response.data
    }
  )

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div>
      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </label>
            <select
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Makes</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minYear"
                value={filters.minYear}
                onChange={handleFilterChange}
                className="input"
                placeholder="Min"
              />
              <input
                type="number"
                name="maxYear"
                value={filters.maxYear}
                onChange={handleFilterChange}
                className="input"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles?.map((vehicle) => (
            <div key={vehicle.id} className="card">
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-primary-600 font-bold">
                  ${vehicle.price.toLocaleString()}
                </p>
                <p className="text-gray-600">{vehicle.mileage.toLocaleString()} miles</p>
                <p className="text-gray-600">
                  {vehicle.transmission} • {vehicle.fuelType}
                </p>
              </div>
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="btn btn-primary block text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleList 