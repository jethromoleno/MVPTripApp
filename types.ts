// Enums matching the Schema
export enum EmployeeRole {
  DRIVER = 'Driver',
  HELPER = 'Helper',
  ENCODER = 'Encoder'
}

export enum EmployeeStatus {
  AVAILABLE = 'Available',
  ON_TRIP = 'On Trip'
}

export enum TruckStatus {
  AVAILABLE = 'Available',
  IN_USE = 'In Use',
  MAINTENANCE = 'Maintenance'
}

export enum TripStatus {
  ONGOING = 'Ongoing',
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

// Interfaces
export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  rating: number; // 0.0 - 5.0
  image_url: string;
  license_number?: string;
  weekly_hours_current: number; // For UI display
}

export interface Customer {
  customer_id: number;
  name: string;
  contact_info: string;
}

export interface Location {
  location_id: number;
  name: string;
  address_line_1: string;
  city: string;
}

export interface Truck {
  truck_id: number;
  license_plate: string;
  capacity: string;
  status: TruckStatus;
  model: string; 
}

export interface Trip {
  trip_id: number;
  trip_code: string;
  customer: Customer;
  truck: Truck;
  driver: Employee;
  origin: Location;
  destination: Location;
  start_date: string; // ISO String
  end_date: string;   // ISO String
  status: TripStatus;
  cargo_type: string;
  priority: Priority;
}

export interface AvailabilityResponse {
  available_drivers: Employee[];
  available_trucks: Truck[];
}