// components/ScheduleModal.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Calendar, MapPin, Package, AlertCircle, Search } from 'lucide-react';
import { Customer, Priority, Employee, Truck, Location } from '../types';
// MOCK_CUSTOMERS and MOCK_LOCATIONS imports removed
import { apiService } from '../services/apiService';
import { DriverCard } from './DriverCard';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void; // Called after successful trip creation
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSave }) => {
    // --- Master Data State (Fetched from API) ---
    const [liveCustomers, setLiveCustomers] = useState<Customer[]>([]);
    const [liveLocations, setLiveLocations] = useState<Location[]>([]);
    const [isLoadingMasterData, setIsLoadingMasterData] = useState(false);

    // --- Form State ---
    const [selectedCustomer, setSelectedCustomer] = useState<number | ''>('');
    const [origin, setOrigin] = useState<number | ''>('');
    const [destination, setDestination] = useState<number | ''>('');
    const [cargoType, setCargoType] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const [instructions, setInstructions] = useState('');
    
    // --- Availability & Assignment State ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [availableDrivers, setAvailableDrivers] = useState<Employee[]>([]);
    const [availableTrucks, setAvailableTrucks] = useState<Truck[]>([]);
    
    // Core selection states
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null); // New state for selected truck ID
    
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- 1. Fetch Initial Master Data (Customers, Locations) ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingMasterData(true);
            try {
                const [customers, locations] = await Promise.all([
                    apiService.fetchCustomers(),
                    apiService.fetchLocations(),
                ]);
                setLiveCustomers(customers);
                setLiveLocations(locations);
            } catch (e) {
                console.error("Error fetching initial form data:", e);
                setError("Failed to load customer and location lists.");
            } finally {
                setIsLoadingMasterData(false);
            }
        };

        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);

    // --- 2. Availability Logic (Triggered when dates change) ---
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!startDate || !endDate) return;

            setIsLoadingAvailability(true);
            setError(null);
            
            try {
                const response = await apiService.checkAvailability(startDate, endDate);
                setAvailableDrivers(response.available_drivers);
                setAvailableTrucks(response.available_trucks);
                
                // Auto deselect if currently selected driver is no longer available
                if (selectedDriverId) {
                    const isStillAvailable = response.available_drivers.some(d => d.employee_id === selectedDriverId);
                    if (!isStillAvailable) {
                        setSelectedDriverId(null);
                        setSelectedTruckId(null);
                    }
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to check availability. Please try again.");
            } finally {
                setIsLoadingAvailability(false);
            }
        };

        fetchAvailability();
    }, [startDate, endDate, selectedDriverId]);
    
    // --- 3. Handle Driver/Truck Selection ---
    const handleSelectDriver = (driver: Employee, assignedTruck?: Truck) => {
        setSelectedDriverId(driver.employee_id);
        // For MVP, if a truck is visually assigned, select its ID
        setSelectedTruckId(assignedTruck?.truck_id || null);
    };

    // --- 4. Handle Trip Submission ---
    const handleScheduleTrip = useCallback(async () => {
        // Basic validation check
        if (!selectedCustomer || !origin || !destination || !startDate || !endDate || !selectedDriverId || !selectedTruckId) {
            setError("Please fill all required fields and select a driver/truck.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const tripData = {
            customer: selectedCustomer,
            origin_location: origin,
            destination_location: destination,
            scheduled_start_time: startDate,
            scheduled_end_time: endDate,
            cargo_type: cargoType,
            priority: priority,
            special_instructions: instructions,
            driver: selectedDriverId,
            truck: selectedTruckId,
            // status automatically set by Django to 'Scheduled' or 'Upcoming'
        };

        try {
            await apiService.createTrip(tripData);
            onSave(); // Call parent success handler
            onClose(); // Close the modal
        } catch (err: any) {
            console.error("Trip submission failed:", err);
            setError(`Trip creation failed: ${err.message || "Server error."}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedCustomer, origin, destination, startDate, endDate, selectedDriverId, selectedTruckId, cargoType, priority, instructions, onSave, onClose]);


    if (!isOpen) return null;

    // Determine the loading state for form fields
    const isFormLoading = isLoadingMasterData || isSubmitting;
    const isScheduleDisabled = !selectedDriverId || !selectedTruckId || !startDate || !endDate || isSubmitting;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-900 rounded-2xl w-full max-w-6xl h-[90vh] border border-dark-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-dark-800 flex items-center justify-between bg-dark-950">
                    <div>
                        <h2 className="text-xl font-bold text-white">Schedule New Trip</h2>
                        <p className="text-sm text-zinc-400">Create a new shipment order and assign resources.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-dark-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Two Columns */}
                <div className="flex-1 grid grid-cols-12 overflow-hidden">
                    
                    {/* LEFT COLUMN: Trip Info (Static) */}
                    <div className="col-span-4 p-6 overflow-y-auto border-r border-dark-800 space-y-6 bg-dark-900">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Trip Information</h3>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        
                        {/* Client */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Client</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-2.5 text-zinc-200 focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none appearance-none disabled:opacity-50"
                                    value={selectedCustomer}
                                    onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                                    disabled={isFormLoading}
                                >
                                    <option value="" disabled>
                                        {isLoadingMasterData ? 'Loading Customers...' : 'Select Customer'}
                                    </option>
                                    {/* Using liveCustomers */}
                                    {liveCustomers.map(c => (
                                        <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
                                    ))}
                                </select>
                                <Search className="absolute right-3 top-3 w-4 h-4 text-zinc-600 pointer-events-none" />
                            </div>
                        </div>

                        {/* Route */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-brand-500" /> Origin
                                </label>
                                <select 
                                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-2.5 text-zinc-200 focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none disabled:opacity-50"
                                    value={origin}
                                    onChange={(e) => setOrigin(Number(e.target.value))}
                                    disabled={isFormLoading}
                                >
                                    <option value="" disabled>
                                        {isLoadingMasterData ? 'Loading Locations...' : 'Select Pickup Point'}
                                    </option>
                                    {/* Using liveLocations */}
                                    {liveLocations.map(l => (
                                        <option key={l.location_id} value={l.location_id}>{l.name} ({l.city})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" /> Destination
                                </label>
                                <select 
                                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-2.5 text-zinc-200 focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none disabled:opacity-50"
                                    value={destination}
                                    onChange={(e) => setDestination(Number(e.target.value))}
                                    disabled={isFormLoading}
                                >
                                    <option value="" disabled>
                                        {isLoadingMasterData ? 'Loading Locations...' : 'Select Drop-off Point'}
                                    </option>
                                    {/* Using liveLocations */}
                                    {liveLocations.map(l => (
                                        <option key={l.location_id} value={l.location_id}>{l.name} ({l.city})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Cargo Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Cargo Type</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Electronics"
                                        className="w-full bg-dark-950 border border-dark-800 rounded-lg pl-10 pr-3 py-2.5 text-zinc-200 focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none placeholder-zinc-600"
                                        value={cargoType}
                                        onChange={(e) => setCargoType(e.target.value)}
                                        disabled={isFormLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Priority</label>
                                <select 
                                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-2.5 text-zinc-200 focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none disabled:opacity-50"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    disabled={isFormLoading}
                                >
                                    <option value={Priority.LOW}>Low</option>
                                    <option value={Priority.MEDIUM}>Medium</option>
                                    <option value={Priority.HIGH}>High</option>
                                </select>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Special Instructions</label>
                            <textarea 
                                className="w-full h-32 bg-dark-950 border border-dark-800 rounded-lg p-3 text-zinc-200 focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none resize-none placeholder-zinc-600"
                                placeholder="Gate codes, contact person, handling instructions..."
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                disabled={isFormLoading}
                            ></textarea>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Schedule & Assignment (Smart) */}
                    <div className="col-span-8 p-6 overflow-y-auto bg-dark-950/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Schedule & Resource Assignment</h3>
                            {isLoadingAvailability && (
                                <span className="text-xs text-brand-400 animate-pulse flex items-center gap-1">
                                    Checking availability...
                                </span>
                            )}
                        </div>

                        {/* Date Pickers */}
                        <div className="bg-dark-900 border border-dark-800 rounded-xl p-5 mb-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-400" /> Start Date & Time
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        className="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2.5 text-white color-scheme-dark focus:ring-1 focus:ring-brand-600 outline-none"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-400" /> Est. End Date & Time
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        className="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2.5 text-white color-scheme-dark focus:ring-1 focus:ring-brand-600 outline-none"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-zinc-500">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                Changing dates will automatically refresh the available driver list below.
                            </p>
                        </div>

                        {/* Availability Section */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">
                                Available Drivers <span className="text-zinc-500 font-normal text-base">({availableDrivers.length})</span>
                            </h4>

                            {/* Empty States (unchanged) */}
                            {!startDate || !endDate ? (
                                <div className="h-64 border-2 border-dashed border-dark-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                                    <Calendar className="w-12 h-12 mb-2 opacity-50" />
                                    <p>Select dates to check driver availability</p>
                                </div>
                            ) : isLoadingAvailability ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="h-32 bg-dark-800 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : availableDrivers.length === 0 ? (
                                <div className="h-64 bg-dark-900/50 rounded-xl flex flex-col items-center justify-center text-zinc-500 border border-dark-800">
                                    <AlertCircle className="w-12 h-12 mb-2 text-red-500 opacity-50" />
                                    <p>No drivers available for this time range.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {availableDrivers.map(driver => {
                                        // Simple logic to assign a truck for display/selection
                                        const mockAssignedTruck = availableTrucks.length > 0 ? availableTrucks[driver.employee_id % availableTrucks.length] : undefined;

                                        return (
                                            <DriverCard 
                                                key={driver.employee_id}
                                                driver={driver}
                                                assignedTruck={mockAssignedTruck}
                                                isSelected={selectedDriverId === driver.employee_id}
                                                // Call new handler to select driver AND truck ID
                                                onSelect={() => handleSelectDriver(driver, mockAssignedTruck)}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-dark-800 bg-dark-950 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-dark-700 text-zinc-300 font-medium hover:bg-dark-800 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleScheduleTrip} // Use the new submission handler
                        disabled={isScheduleDisabled}
                        className="px-6 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                Scheduling...
                            </>
                        ) : (
                            "Schedule Trip"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};