import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';

interface DashboardStats {
  totalVehicles: number;
  activeListings: number;
  totalViews: number;
  inquiries: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { dealer } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeListings: 0,
    totalViews: 0,
    inquiries: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehiclesResponse, activitiesResponse] = await Promise.all([
          axios.get('/vehicles'),
          axios.get('/activities')
        ]);

        const vehicles = vehiclesResponse.data.vehicles;
        setStats({
          totalVehicles: vehicles.length,
          activeListings: vehicles.filter((v: any) => v.status === 'active').length,
          totalViews: vehicles.reduce((sum: number, v: any) => sum + (v.views || 0), 0),
          inquiries: vehicles.reduce((sum: number, v: any) => sum + (v.inquiries || 0), 0),
        });

        setRecentActivities(activitiesResponse.data.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {dealer?.name}</h1>
        <p className="mt-2 text-gray-600">{dealer?.companyName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Vehicles</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalVehicles}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.activeListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">{stats.totalViews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Inquiries</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">{stats.inquiries}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/vehicles/create"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="text-gray-700">Add New Vehicle</span>
          </Link>
          <Link
            to="/manage-vehicles"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="text-gray-700">Manage Vehicles</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="text-gray-700">Update Profile</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm">
                    {activity.type.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 