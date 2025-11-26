// pages/DriverManagement.tsx (Example Component)

import React, { useState, useEffect, useMemo } from 'react';
import { DriverCard } from '../components/DriverCard';
import { Employee, Truck } from '../types'; // Import the defined types

const BASE_API_URL = "http://127.0.0.1:8000/api/";

const DriverManagement = () => {
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
    const [allTrucks, setAllTrucks] = useState<Truck[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // --- DATA FETCHING ---
    useEffect(() => {
        // Fetch employees and trucks concurrently
        Promise.all([
            fetch(`${BASE_API_URL}employees/`).then(res => res.json()),
            fetch(`${BASE_API_URL}trucks/`).then(res => res.json()),
        ])
        .then(([employeeData, truckData]) => {
            // NOTE: You must update your Django model/serializer 
            // to include 'weekly_hours_current' 
            // OR mock it here to prevent TypeScript errors.
            const mockedEmployeeData = employeeData.map((emp: any) => ({
                ...emp,
                // Temporary mock data for the missing field:
                weekly_hours_current: Math.floor(Math.random() * 40) 
            }))

            setAllEmployees(mockedEmployeeData);
            setAllTrucks(truckData);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching API data:", error);
            setLoading(false);
        });
    }, []);

    // Filter down to only drivers
    const drivers = useMemo(() => allEmployees.filter(emp => emp.role === 'Driver'), [allEmployees]);
    
    // --- RENDERING ---
    if (loading) return <div className="p-10 text-xl">Loading Fleet Data...</div>;
    
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Driver & Truck Assignment</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map(driver => {
                    // Simple logic to find an assigned truck (you'll need more complex logic later)
                    const assignedTruck = allTrucks.find(truck => truck.status === 'In Use'); 
                    
                    return (
                        <DriverCard
                            key={driver.employee_id}
                            driver={driver}
                            assignedTruck={assignedTruck} // Pass the found truck or undefined
                            isSelected={driver.employee_id === selectedDriverId}
                            onSelect={() => setSelectedDriverId(driver.employee_id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DriverManagement;