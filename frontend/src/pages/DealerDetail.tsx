import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'

interface Dealer {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description: string
  logoUrl: string
  website: string
  businessHours: {
    day: string
    hours: string
  }[]
}

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

const DealerDetail = () => {
  const { id } = useParams<{ id: string }>()

  const { data: dealer, isLoading: isLoadingDealer } = useQuery<Dealer>(
    ['dealer', id],
    async () => {
      const response = await axios.get(`/api/dealers/${id}`)
      return response.data
    }
  )

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>(
    ['dealerVehicles', id],
    async () => {
      const response = await axios.get(`/api/dealers/${id}/vehicles`)
      return response.data
    }
  )

  if (isLoadingDealer || isLoadingVehicles) {
    return <div className="text-center">Loading...</div>
  }

  if (!dealer) {
    return <div className="text-center">Dealer not found</div>
  }

  return (
    <div>
      {/* Dealer Header */}
      <div className="bg-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center">
            <img
              src={dealer.logoUrl}
              alt={dealer.name}
              className="w-24 h-24 object-contain mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{dealer.name}</h1>
              <p className="text-gray-600">{dealer.address}</p>
              <div className="mt-2 space-x-4">
                <a
                  href={`tel:${dealer.phone}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {dealer.phone}
                </a>
                <a
                  href={`mailto:${dealer.email}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {dealer.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dealer Information */}
          <div className="lg:col-span-1">
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4">About Us</h2>
              <p className="text-gray-700 mb-6">{dealer.description}</p>
              <a
                href={dealer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary block text-center"
              >
                Visit Website
              </a>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              <div className="space-y-2">
                {dealer.businessHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex justify-between text-gray-600"
                  >
                    <span>{schedule.day}</span>
                    <span>{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Listings */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-gray-600">
                      {vehicle.mileage.toLocaleString()} miles
                    </p>
                    <p className="text-gray-600">
                      {vehicle.transmission} • {vehicle.fuelType}
                    </p>
                  </div>
                  <button className="btn btn-primary w-full">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealerDetail 