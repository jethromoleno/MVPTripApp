import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Trip, TripStatus } from '../types';
import { apiService } from '../services/apiService';
import { ScheduleModal } from '../components/ScheduleModal';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    const data = await apiService.getTrips();
    setTrips(data);
    setIsLoading(false);
  };

  const handleSaveTrip = async () => {
    // In a real app, we would gather data from the modal and pass it here
    // For this MVP, we just simulate a refresh
    setIsModalOpen(false);
    await loadTrips(); // Refresh list
    alert("Trip scheduled successfully!");
  };

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case TripStatus.ONGOING:
        return 'bg-brand-500/10 text-brand-400 border-brand-500/20'; // Purple
      case TripStatus.UPCOMING:
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'; // Orange
      case TripStatus.COMPLETED:
        return 'bg-green-500/10 text-green-400 border-green-500/20'; // Green
      case TripStatus.DELAYED:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Trips</h1>
          <p className="text-zinc-400">Live Operations Board</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-brand-900/50"
        >
          <Plus className="w-5 h-5" />
          Schedule New Trip
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-950/50 text-zinc-500 text-xs uppercase tracking-wider font-semibold border-b border-dark-800">
              <th className="px-6 py-4">Trip Code</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Driver & Truck</th>
              <th className="px-6 py-4">Start Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {isLoading ? (
               <tr>
                 <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 animate-pulse">
                   Loading Operations Board...
                 </td>
               </tr>
            ) : trips.length === 0 ? (
              <tr>
                 <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                   No trips scheduled.
                 </td>
               </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.trip_id} className="hover:bg-dark-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-300 text-sm">{trip.trip_code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium block">{trip.customer.name}</span>
                    <span className="text-zinc-500 text-xs">Contract #{trip.trip_id * 34}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-300">{trip.origin.city}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-600" />
                      <span className="text-zinc-300">{trip.destination.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={trip.driver.image_url} 
                        alt={trip.driver.first_name} 
                        className="w-8 h-8 rounded-full border border-dark-700"
                      />
                      <div>
                        <div className="text-sm text-zinc-200">{trip.driver.first_name} {trip.driver.last_name.charAt(0)}.</div>
                        <div className="text-xs text-zinc-500 font-mono">{trip.truck.license_plate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">
                      {new Date(trip.start_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(trip.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-1 rounded hover:bg-dark-700">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ScheduleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTrip} 
      />
    </div>
  );
};