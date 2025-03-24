import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: { imageUrl: string }[];
}

const Home = () => {
  const { data: featuredVehicles, isLoading } = useQuery<Vehicle[]>(
    'featuredVehicles',
    async () => {
      const response = await axios.get('/api/vehicles/featured');
      return response.data;
    }
  );

  const categories = [
    { name: 'SUVs', count: 150, icon: '🚗' },
    { name: 'Sedans', count: 200, icon: '🚙' },
    { name: 'Sports Cars', count: 75, icon: '🏎️' },
    { name: 'Electric', count: 50, icon: '⚡' },
    { name: 'Luxury', count: 100, icon: '💎' },
    { name: 'Commercial', count: 80, icon: '🚛' },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Vehicle
          </h1>
          <p className="text-xl mb-8">
            Browse through our extensive collection of quality vehicles
          </p>
          <Link
            to="/vehicles"
            className="bg-white text-primary-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            View Vehicles
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900">Browse by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/vehicles?category=${category.name.toLowerCase()}`}
              className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{category.count} vehicles</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Vehicles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Vehicles</h2>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles?.map((vehicle) => (
                <div key={vehicle.id} className="card">
                  <img
                    src={vehicle.images[0]?.imageUrl || '/placeholder.png'}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-primary-600 font-bold mb-4">
                    ${vehicle.price.toLocaleString()}
                  </p>
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
      </section>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to sell your vehicle?</span>
            <span className="block text-secondary">List it with us today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/dealer/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 