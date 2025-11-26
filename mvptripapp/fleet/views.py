# mvptripapp/fleet/views.py
from rest_framework import viewsets
from .models import (
    Employee, Customer, Location, Truck, Trip, TripEvent, TripFuelLog
)
from .serializers import (
    EmployeeSerializer, CustomerSerializer, LocationSerializer, TruckSerializer,
    TripSerializer, TripEventSerializer, TripFuelLogSerializer
)

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