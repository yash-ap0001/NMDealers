import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  vehicleCount: number
}

const DealerList = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: dealers, isLoading } = useQuery<Dealer[]>(
    ['dealers', searchTerm],
    async () => {
      const response = await axios.get('/api/dealers', {
        params: { search: searchTerm },
      })
      return response.data
    }
  )

  return (
    <div>
      {/* Search */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">Find a Dealer</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search dealers by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Dealer List */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealers?.map((dealer) => (
            <div key={dealer.id} className="card">
              <div className="flex items-center mb-4">
                <img
                  src={dealer.logoUrl}
                  alt={dealer.name}
                  className="w-16 h-16 object-contain mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{dealer.name}</h3>
                  <p className="text-gray-600">{dealer.vehicleCount} vehicles</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">{dealer.address}</p>
                <p className="text-gray-600">{dealer.phone}</p>
                <p className="text-gray-600">{dealer.email}</p>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-2">{dealer.description}</p>
              <Link
                to={`/dealers/${dealer.id}`}
                className="btn btn-primary block text-center"
              >
                View Dealer
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DealerList 