import { MOCK_EMPLOYEES, MOCK_TRIPS, MOCK_TRUCKS } from '../constants';
import { AvailabilityResponse, Trip, TruckStatus, EmployeeStatus } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  getTrips: async (): Promise<Trip[]> => {
    await delay(500);
    return [...MOCK_TRIPS].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  },

  /**
   * IMPORTANT LOGIC:
   * Query the Trip table to find which Drivers and Trucks are NOT booked during this requested window.
   */
  checkAvailability: async (startDate: string, endDate: string): Promise<AvailabilityResponse> => {
    await delay(800); // Simulate API latency

    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd)) {
      return { available_drivers: [], available_trucks: [] };
    }

    // 1. Find IDs of resources booked in conflicting trips
    const busyDriverIds = new Set<number>();
    const busyTruckIds = new Set<number>();

    MOCK_TRIPS.forEach(trip => {
      const tripStart = new Date(trip.start_date).getTime();
      const tripEnd = new Date(trip.end_date).getTime();

      // Check for overlap
      // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
      if (reqStart <= tripEnd && reqEnd >= tripStart) {
        if (trip.status !== 'Completed' && trip.status !== 'Delayed') { // Assume Delayed might free up resources differently, but for MVP strict check
           busyDriverIds.add(trip.driver.employee_id);
           busyTruckIds.add(trip.truck.truck_id);
        }
      }
    });

    // 2. Filter Master lists
    // Note: In a real DB query, we would also filter by status='Available' in the Employee/Truck table itself,
    // but the availability check is primarily about *scheduled* conflicts. 
    // We also exclude those currently marked as "Maintenance" or permanently unavailable.

    const availableDrivers = MOCK_EMPLOYEES.filter(emp => {
      // Driver is available if NOT in the busy list
      return !busyDriverIds.has(emp.employee_id);
    });

    const availableTrucks = MOCK_TRUCKS.filter(truck => {
      // Truck is available if NOT in busy list AND not in Maintenance
      return !busyTruckIds.has(truck.truck_id) && truck.status !== TruckStatus.MAINTENANCE;
    });

    return {
      available_drivers: availableDrivers,
      available_trucks: availableTrucks
    };
  },

  createTrip: async (newTrip: Partial<Trip>): Promise<boolean> => {
    await delay(1000);
    // In a real app, we would push to MOCK_TRIPS here to update local state
    console.log("Creating trip:", newTrip);
    return true;
  }
};