// src/types.ts

// ====================================================================
// Interfaces matching Django Fleet Models
// ====================================================================

/** Matches the data structure from the /api/employees/ endpoint */
export interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    
    // Matched Fields for DriverCard
    rating: number; // Django DecimalField maps to number
    image_url: string | null;
    
    // NOTE: This field (weekly_hours_current) is used in DriverCard.tsx 
    // but IS NOT present in your Django Employee model. 
    // You will need to add it to your Django model, or calculate it 
    // via a SerializerMethodField in Django, or mock it in React for now.
    weekly_hours_current: number; 

    // Additional fields from Django model
    role: 'Driver' | 'Helper' | 'Encoder';
    status: 'Available' | 'On Trip';
    license_number: string | null;
    created_at: string;
    updated_at: string;
}

/** Matches the data structure from the /api/trucks/ endpoint */
export interface Truck {
    truck_id: number;
    license_plate: string; // Used in DriverCard.tsx
    
    // Additional fields from Django model
    vin: string | null;
    tonner_capacity: number;
    status: 'Available' | 'In Use' | 'Maintenance';
    created_at: string;
    updated_at: string;
}

// You will eventually need these interfaces for other API endpoints
export interface Customer {
    customer_id: number;
    name: string;
    contact_name: string;
    contact_phone: string | null;
}

export interface Location {
    location_id: number;
    name: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    is_hub: boolean;
}

export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

// Ensure the Employee type has fields for DriverCard
export interface Employee {
    employee_id: number;
    first_name: string;
    last_name: string;
    role: 'Driver' | 'Helper' | 'Encoder';
    rating: number; 
    weekly_hours_current: number; // Field added in the previous step
    image_url: string | null; // Needed for DriverCard
    // ... other fields
}

// ... other models like Trip, TripEvent, TripFuelLog