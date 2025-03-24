import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: string
  fuelType: string
  description: string
  images: {
    id: number
    imageUrl: string
  }[]
  dealer: {
    id: number
    name: string
    phone: string
    email: string
    address: string
  }
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: vehicle, isLoading } = useQuery<Vehicle>(
    ['vehicle', id],
    async () => {
      const response = await axios.get(`/api/vehicles/${id}`)
      return response.data
    }
  )

  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  if (!vehicle) {
    return <div className="text-center">Vehicle not found</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div>
        <div className="relative aspect-w-16 aspect-h-9 mb-4">
          <img
            src={vehicle.images[selectedImage]?.imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {vehicle.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${
                  index + 1
                }`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>
        <p className="text-2xl text-primary-600 font-bold mb-6">
          ${vehicle.price.toLocaleString()}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Mileage</p>
            <p className="font-medium">{vehicle.mileage.toLocaleString()} miles</p>
          </div>
          <div>
            <p className="text-gray-600">Transmission</p>
            <p className="font-medium">{vehicle.transmission}</p>
          </div>
          <div>
            <p className="text-gray-600">Fuel Type</p>
            <p className="font-medium">{vehicle.fuelType}</p>
          </div>
          <div>
            <p className="text-gray-600">Year</p>
            <p className="font-medium">{vehicle.year}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{vehicle.description}</p>
        </div>

        {/* Dealer Information */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Dealer Information</h2>
          <div className="space-y-2">
            <p className="font-medium">{vehicle.dealer.name}</p>
            <p className="text-gray-600">{vehicle.dealer.address}</p>
            <p className="text-gray-600">{vehicle.dealer.phone}</p>
            <p className="text-gray-600">{vehicle.dealer.email}</p>
          </div>
          <button className="btn btn-primary mt-4 w-full">
            Contact Dealer
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetail 