import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            ND Motors
          </Link>
          <div className="flex space-x-4">
            <Link to="/vehicles" className="text-gray-700 hover:text-primary-600">
              Vehicles
            </Link>
            <Link to="/dealers" className="text-gray-700 hover:text-primary-600">
              Dealers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 