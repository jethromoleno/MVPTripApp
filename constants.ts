import { Customer, Employee, EmployeeRole, EmployeeStatus, Location, Priority, Trip, TripStatus, Truck, TruckStatus } from './types';

// Mock Employees (Drivers)
export const MOCK_EMPLOYEES: Employee[] = [
  {
    employee_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    role: EmployeeRole.DRIVER,
    status: EmployeeStatus.AVAILABLE,
    rating: 4.8,
    image_url: 'https://picsum.photos/id/1005/200/200',
    weekly_hours_current: 35,
    license_number: 'LIC-99887'
  },
  {
    employee_id: 2,
    first_name: 'Michael',
    last_name: 'Smith',
    role: EmployeeRole.DRIVER,
    status: EmployeeStatus.ON_TRIP,
    rating: 4.5,
    image_url: 'https://picsum.photos/id/1012/200/200',
    weekly_hours_current: 42,
    license_number: 'LIC-11223'
  },
  {
    employee_id: 3,
    first_name: 'Sarah',
    last_name: 'Connor',
    role: EmployeeRole.DRIVER,
    status: EmployeeStatus.AVAILABLE,
    rating: 4.9,
    image_url: 'https://picsum.photos/id/1027/200/200',
    weekly_hours_current: 10,
    license_number: 'LIC-77665'
  },
  {
    employee_id: 4,
    first_name: 'David',
    last_name: 'Martinez',
    role: EmployeeRole.DRIVER,
    status: EmployeeStatus.AVAILABLE,
    rating: 3.8,
    image_url: 'https://picsum.photos/id/1001/200/200',
    weekly_hours_current: 20,
    license_number: 'LIC-55443'
  },
  {
    employee_id: 5,
    first_name: 'Elena',
    last_name: 'Rodriguez',
    role: EmployeeRole.DRIVER,
    status: EmployeeStatus.AVAILABLE,
    rating: 5.0,
    image_url: 'https://picsum.photos/id/1011/200/200',
    weekly_hours_current: 0,
    license_number: 'LIC-33221'
  }
];

// Mock Trucks
export const MOCK_TRUCKS: Truck[] = [
  { truck_id: 1, license_plate: 'TRK-001', capacity: '10 Ton', status: TruckStatus.AVAILABLE, model: 'Volvo FH16' },
  { truck_id: 2, license_plate: 'TRK-002', capacity: '6 Ton', status: TruckStatus.IN_USE, model: 'Isuzu Elf' },
  { truck_id: 3, license_plate: 'TRK-003', capacity: '12 Ton', status: TruckStatus.AVAILABLE, model: 'Scania R-Series' },
  { truck_id: 4, license_plate: 'TRK-004', capacity: '10 Ton', status: TruckStatus.MAINTENANCE, model: 'Volvo FH16' },
  { truck_id: 5, license_plate: 'TRK-005', capacity: '4 Ton', status: TruckStatus.AVAILABLE, model: 'Hino 300' },
];

// Mock Customers
export const MOCK_CUSTOMERS: Customer[] = [
  { customer_id: 1, name: 'East Coast Haulers', contact_info: 'contact@eastcoast.com' },
  { customer_id: 2, name: 'Global Logistics Inc', contact_info: 'ops@global.com' },
  { customer_id: 3, name: 'Fresh Foods Market', contact_info: 'supply@freshfoods.com' },
];

// Mock Locations
export const MOCK_LOCATIONS: Location[] = [
  { location_id: 1, name: 'Manila Hub', address_line_1: 'Port Area', city: 'Manila' },
  { location_id: 2, name: 'Laguna Warehouse', address_line_1: 'Industrial Park', city: 'Santa Rosa' },
  { location_id: 3, name: 'Batangas Port', address_line_1: 'Pier 2', city: 'Batangas City' },
  { location_id: 4, name: 'QC Distribution Center', address_line_1: 'North Ave', city: 'Quezon City' },
];

// Mock Existing Trips
export const MOCK_TRIPS: Trip[] = [
  {
    trip_id: 101,
    trip_code: 'TRP-2023-001',
    customer: MOCK_CUSTOMERS[0],
    truck: MOCK_TRUCKS[1], // In Use
    driver: MOCK_EMPLOYEES[1], // Michael Smith (On Trip)
    origin: MOCK_LOCATIONS[0],
    destination: MOCK_LOCATIONS[2],
    start_date: new Date(Date.now() - 86400000).toISOString(), // Started yesterday
    end_date: new Date(Date.now() + 86400000).toISOString(),   // Ends tomorrow
    status: TripStatus.ONGOING,
    cargo_type: 'Electronics',
    priority: Priority.HIGH
  },
  {
    trip_id: 102,
    trip_code: 'TRP-2023-002',
    customer: MOCK_CUSTOMERS[1],
    truck: MOCK_TRUCKS[0],
    driver: MOCK_EMPLOYEES[0],
    origin: MOCK_LOCATIONS[1],
    destination: MOCK_LOCATIONS[3],
    start_date: new Date(Date.now() + 172800000).toISOString(), // Starts in 2 days
    end_date: new Date(Date.now() + 259200000).toISOString(),
    status: TripStatus.UPCOMING,
    cargo_type: 'Furniture',
    priority: Priority.MEDIUM
  },
  {
    trip_id: 103,
    trip_code: 'TRP-2023-000',
    customer: MOCK_CUSTOMERS[2],
    truck: MOCK_TRUCKS[0],
    driver: MOCK_EMPLOYEES[0],
    origin: MOCK_LOCATIONS[2],
    destination: MOCK_LOCATIONS[0],
    start_date: new Date(Date.now() - 604800000).toISOString(), // Last week
    end_date: new Date(Date.now() - 518400000).toISOString(),
    status: TripStatus.COMPLETED,
    cargo_type: 'Perishables',
    priority: Priority.HIGH
  }
];