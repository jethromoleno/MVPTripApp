-- ====================================================================
-- MVPTripApp - Fleet Management System Database Schema (PostgreSQL)
-- Based on the provided table design.
-- ====================================================================

-- 1. ENUM/CHECK CONSTRAINT DEFINITIONS
-- We define enums where appropriate to ensure data integrity and make the schema self-documenting.

-- Employee roles
CREATE TYPE employee_role_type AS ENUM ('Driver', 'Helper', 'Encoder');
-- Employee/Driver status
CREATE TYPE employee_status_type AS ENUM ('Available', 'On Trip');
-- Truck status
CREATE TYPE truck_status_type AS ENUM ('Available', 'In Use', 'Maintenance');
-- Trip status
CREATE TYPE trip_status_type AS ENUM ('Scheduled', 'In Transit', 'Completed', 'Cancelled', 'Rescue', 'Backload');
-- Load Type
CREATE TYPE load_type_type AS ENUM ('Dry', 'Chilled', 'Ref', 'Combi');
-- Trip Event Type
CREATE TYPE trip_event_type AS ENUM ('Loading_Start', 'Loading_Arrival', 'Unloading_Start', 'Unloading_Finish', 'Rescue_Arrival', 'Delay_Report', 'Trip_Created');


-- ====================================================================
-- 2. MASTER DATA TABLES
-- ====================================================================

-- Employees Table
CREATE TABLE Employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role employee_role_type NOT NULL,
    status employee_status_type NOT NULL DEFAULT 'Available',
    license_number VARCHAR(50),
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    image_url VARCHAR(255) NULL, -- For UI display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(50)
);

-- Locations Table
CREATE TABLE Locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(100),
    city VARCHAR(100),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    is_hub BOOLEAN NOT NULL DEFAULT FALSE
);

-- Trucks Table
CREATE TABLE Trucks (
    truck_id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(50) UNIQUE,
    tonner_capacity SMALLINT NOT NULL CHECK (tonner_capacity > 0),
    status truck_status_type NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ====================================================================
-- 3. TRIP SCHEDULING & MONITORING TABLES
-- ====================================================================

-- Trips Table
CREATE TABLE Trips (
    trip_id SERIAL PRIMARY KEY,
    trip_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL REFERENCES Customers(customer_id) ON DELETE RESTRICT,
    truck_id INT NOT NULL REFERENCES Trucks(truck_id) ON DELETE RESTRICT,
    driver_id INT NOT NULL REFERENCES Employees(employee_id) ON DELETE RESTRICT,
    helper1_id INT REFERENCES Employees(employee_id) ON DELETE SET NULL, -- Optional Helper
    helper2_id INT REFERENCES Employees(employee_id) ON DELETE SET NULL, -- Optional Helper
    origin_location_id INT NOT NULL REFERENCES Locations(location_id) ON DELETE RESTRICT,
    destination_location_id INT NOT NULL REFERENCES Locations(location_id) ON DELETE RESTRICT,
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_time TIMESTAMP WITH TIME ZONE, -- Estimated Arrival/End Date from UI
    status trip_status_type NOT NULL DEFAULT 'Scheduled',
    load_type load_type_type,
    loading_ref_no VARCHAR(50),
    net_weight NUMERIC(10, 2),
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_completion_time TIMESTAMP WITH TIME ZONE,
    special_instructions TEXT, -- Added from UI mockups
    priority VARCHAR(10) DEFAULT 'Low', -- Added from UI mockups (High/Low)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trip Events Table (for telematics and operational logging)
CREATE TABLE Trip_Events (
    event_id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES Trips(trip_id) ON DELETE CASCADE,
    encoder_id INT REFERENCES Employees(employee_id) ON DELETE SET NULL,
    event_type trip_event_type NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location_lat NUMERIC(10, 6) NULL, -- GPS data when event happened
    location_lon NUMERIC(10, 6) NULL,
    document_no VARCHAR(100), -- For Unloading/Loading documents
    notes TEXT
);

-- Trip Fuel Logs Table (for billing and cost management)
CREATE TABLE Trip_Fuel_Logs (
    fuel_id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES Trips(trip_id) ON DELETE CASCADE,
    encoder_id INT REFERENCES Employees(employee_id) ON DELETE SET NULL,
    fuel_ref_no VARCHAR(50) NOT NULL,
    liters NUMERIC(10, 2) NOT NULL CHECK (liters > 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    fueling_location_id INT REFERENCES Locations(location_id) ON DELETE RESTRICT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);