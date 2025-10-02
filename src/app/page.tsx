export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Network Device Inventory
      </h1>
      
      <div className="text-center mb-12">
        <p className="text-lg text-gray-600 mb-4">
          Comprehensive network device management and tracking system
        </p>
        <p className="text-sm text-gray-500">
          Phase 2 development in progress...
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Device Management</h2>
          <p className="text-gray-600">
            Add, edit, and delete network devices with detailed information
          </p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Inventory Tracking</h2>
          <p className="text-gray-600">
            Maintain comprehensive records of device specifications and locations
          </p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Status Monitoring</h2>
          <p className="text-gray-600">
            Real-time device status and health checks
          </p>
        </div>
      </div>
    </main>
  )
}