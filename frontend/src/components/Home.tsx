import React from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';

interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: { imageUrl: string }[];
}

const Home: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await axios.get('/vehicles?limit=3');
        setFeaturedVehicles(response.data.vehicles);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-[#001635]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="/hero-bg.jpg"
            alt="Hero background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect Vehicle
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            Browse through our extensive collection of vehicles. From luxury cars to practical SUVs, we have something for everyone.
          </p>
          <div className="mt-10">
            <Link
              to="/vehicles"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Vehicles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Vehicles
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Check out our latest and most popular vehicles
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                to={`/vehicles/${vehicle.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={vehicle.images[0]?.imageUrl || '/placeholder-vehicle.jpg'}
                      alt={vehicle.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {vehicle.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="mt-2 text-xl font-bold text-blue-600">
                      ${vehicle.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Quality Assured</h3>
              <p className="mt-2 text-base text-gray-500">
                All vehicles undergo thorough inspection and quality checks
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Quick Process</h3>
              <p className="mt-2 text-base text-gray-500">
                Simple and fast vehicle purchase process
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Expert Support</h3>
              <p className="mt-2 text-base text-gray-500">
                Professional assistance throughout your purchase journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 