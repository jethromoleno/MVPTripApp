// services/apiService.ts

import { Trip, Employee, Truck, Customer, Location } from '../types';

// Define the response structure for the availability check
interface AvailabilityResponse {
    available_drivers: Employee[];
    available_trucks: Truck[];
}

// Base URL for the Django REST Framework API
const BASE_API_URL = "http://127.0.0.1:8000/api/";

export const apiService = {
    // --- Master Data Fetchers (To replace MOCK_CUSTOMERS, MOCK_LOCATIONS) ---
    
    /**
     * Fetches all customers from the backend.
     */
    fetchCustomers: async (): Promise<Customer[]> => {
        const response = await fetch(`${BASE_API_URL}customers/`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        return response.json();
    },

    /**
     * Fetches all locations from the backend.
     */
    fetchLocations: async (): Promise<Location[]> => {
        const response = await fetch(`${BASE_API_URL}locations/`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        return response.json();
    },

    // --- Trip Data Fetchers and Creators ---

    /**
     * Fetches all trips from the backend.
     */
    getTrips: async (): Promise<Trip[]> => {
        const response = await fetch(`${BASE_API_URL}trips/`);
        if (!response.ok) throw new Error('Failed to fetch trips');
        // Data is now sorted and filtered by the backend (or should be).
        return response.json(); 
    },

    /**
     * IMPORTANT LOGIC:
     * POSTs the date range to the custom Django endpoint for availability check.
     */
    checkAvailability: async (startDate: string, endDate: string): Promise<AvailabilityResponse> => {
        const response = await fetch(`${BASE_API_URL}check_availability/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate }),
        });

        if (!response.ok) {
            // Attempt to read the error message from the backend response
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to check resource availability');
        }

        return response.json();
    },

    /**
     * Creates a new trip by POSTing data to the /trips/ endpoint.
     */
    createTrip: async (newTripData: any): Promise<Trip> => {
        // The data keys must match the fields in your Django Trip model
        const response = await fetch(`${BASE_API_URL}trips/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTripData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // This error will contain validation errors if data is incorrect (e.g., missing required FK)
            throw new Error(`Failed to create trip: ${JSON.stringify(errorData)}`);
        }

        // Return the newly created trip object
        return response.json();
    }
};