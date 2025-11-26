from django.contrib import admin
from .models import Employee, Customer, Location, Truck, Trip, TripEvent, TripFuelLog

# Register all models for visibility in the Django Admin interface
admin.site.register(Employee)
admin.site.register(Customer)
admin.site.register(Location)
admin.site.register(Truck)
admin.site.register(Trip)
admin.site.register(TripEvent)
admin.site.register(TripFuelLog)