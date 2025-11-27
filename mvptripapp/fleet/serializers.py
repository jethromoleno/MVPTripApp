# mvptripapp/fleet/serializers.py
from rest_framework import serializers
from .models import (
    Employee, Customer, Location, Truck, Trip, TripEvent, TripFuelLog
)

# ====================================================================
# MASTER DATA SERIALIZERS
# ====================================================================

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['location_id', 'name', 'city', 'address_line_1'] # Include all necessary fields

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'first_name', 'last_name', 'role', 'rating']

class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = ['truck_id', 'license_plate', 'tonner_capacity']

# ====================================================================
# TRIP & TRANSACTION SERIALIZERS
# ====================================================================

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        # The fields below are the ones defined in your models.py
        fields = [
            'trip_id', 'trip_code', 'customer', 'truck', 'driver', 
            'helper1', 'helper2', 'origin_location', 'destination_location', 
            'scheduled_start_time', 'scheduled_end_time', 'actual_start_time', 
            'actual_completion_time', 'status', 'load_type', 'loading_ref_no', 
            'net_weight', 'cargo_type', 'priority', 'special_instructions', 
            'created_at'
        ]

class TripEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripEvent
        fields = '__all__'

class TripFuelLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripFuelLog
        fields = '__all__'