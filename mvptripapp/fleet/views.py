# mvptripapp/fleet/views.py
from rest_framework import viewsets
from .models import (
    Employee, Customer, Location, Truck, Trip, TripEvent, TripFuelLog
)
from .serializers import (
    EmployeeSerializer, CustomerSerializer, LocationSerializer, TruckSerializer,
    TripSerializer, TripEventSerializer, TripFuelLogSerializer
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EmployeeSerializer, TruckSerializer
from .models import Employee, Truck # Import your models
import datetime 
from django.db.models import Q # Useful for complex lookups


# ====================================================================
# MASTER DATA VIEWSETS
# ====================================================================

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer

# ====================================================================
# TRIP & TRANSACTION VIEWSETS
# ====================================================================

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class TripEventViewSet(viewsets.ModelViewSet):
    queryset = TripEvent.objects.all()
    serializer_class = TripEventSerializer

class TripFuelLogViewSet(viewsets.ModelViewSet):
    queryset = TripFuelLog.objects.all()
    serializer_class = TripFuelLogSerializer

# Define a custom view for complex business logic, not tied to a ModelViewSet
@api_view(['POST'])
def check_availability(request):
    """
    Accepts start and end dates and returns a list of available drivers and trucks.
    """
    start_date_str = request.data.get('startDate')
    end_date_str = request.data.get('endDate')

    if not start_date_str or not end_date_str:
        return Response({"error": "Missing startDate or endDate"}, status=400)
        
    # Convert string dates to datetime objects (handles ISO 8601 format from React's datetime-local)
    try:
        start_time = datetime.datetime.fromisoformat(start_date_str)
        end_time = datetime.datetime.fromisoformat(end_date_str)
    except ValueError:
        return Response({"error": "Invalid date format"}, status=400)

    # --- 1. Filter Out Drivers on Conflicting Trips ---
    # Find employees who are NOT the driver, helper1, or helper2 on any trip 
    # that overlaps with the requested time window.
    conflicting_trips = Trip.objects.filter(
        # The scheduled time window of an existing trip overlaps with the new trip's window.
        Q(scheduled_start_time__lt=end_time) & Q(scheduled_end_time__gt=start_time)
    )
    
    busy_employee_ids = set()
    for trip in conflicting_trips:
        busy_employee_ids.add(trip.driver_id)
        if trip.helper1_id: busy_employee_ids.add(trip.helper1_id)
        if trip.helper2_id: busy_employee_ids.add(trip.helper2_id)

    # Final list of available drivers
    available_drivers = Employee.objects.filter(
        role='Driver',
        status='Available' # Only consider employees who are currently 'Available'
    ).exclude(
        employee_id__in=busy_employee_ids # Exclude those busy during the window
    )
    
    # --- 2. Filter Out Trucks on Conflicting Trips ---
    # Find trucks NOT used in overlapping trips AND currently 'Available'
    busy_truck_ids = conflicting_trips.values_list('truck_id', flat=True).distinct()
    
    available_trucks = Truck.objects.filter(
        status='Available'
    ).exclude(
        truck_id__in=busy_truck_ids
    )

    driver_serializer = EmployeeSerializer(available_drivers, many=True)
    truck_serializer = TruckSerializer(available_trucks, many=True)

    return Response({
        "available_drivers": driver_serializer.data,
        "available_trucks": truck_serializer.data,
    })