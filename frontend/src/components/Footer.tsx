const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">ND Motors</h3>
            <p className="text-gray-400">Your trusted source for quality vehicles</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © {new Date().getFullYear()} ND Motors. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 