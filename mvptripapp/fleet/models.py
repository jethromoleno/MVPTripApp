from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# ====================================================================
# 1. ENUM/CHOICE DEFINITIONS
# ====================================================================

ROLE_CHOICES = (
    ('Driver', 'Driver'),
    ('Helper', 'Helper'),
    ('Encoder', 'Encoder'),
)

EMPLOYEE_STATUS_CHOICES = (
    ('Available', 'Available'),
    ('On Trip', 'On Trip'),
)

TRUCK_STATUS_CHOICES = (
    ('Available', 'Available'),
    ('In Use', 'In Use'),
    ('Maintenance', 'Maintenance'),
)

TRIP_STATUS_CHOICES = (
    ('Scheduled', 'Scheduled'),
    ('In Transit', 'In Transit'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled'),
    ('Rescue', 'Rescue'),
    ('Backload', 'Backload'),
    ('Ongoing', 'Ongoing'),
    ('Upcoming', 'Upcoming'),
    ('Delayed', 'Delayed'),
)

LOAD_TYPE_CHOICES = (
    ('Dry', 'Dry'),
    ('Chilled', 'Chilled'),
    ('Ref', 'Ref'),
    ('Combi', 'Combi'),
)

TRIP_EVENT_TYPE_CHOICES = (
    ('Loading_Start', 'Loading Start'),
    ('Loading_Arrival', 'Loading Arrival'),
    ('Unloading_Start', 'Unloading Start'),
    ('Unloading_Arrival', 'Unloading Arrival'),
    ('Trip_Start', 'Trip Start'),
    ('Trip_End', 'Trip End'),
    ('Fuel', 'Fuel Transaction'),
    ('Stopover', 'Planned Stop'),
    ('Rescue', 'Rescue Event'),
    ('Delayed', 'Delay Noted'),
)

PRIORITY_CHOICES = (
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High'),
    ('Critical', 'Critical'),
)

# ====================================================================
# 2. MASTER DATA MODELS
# ====================================================================

class Employee(models.Model):
    """ Master list of all company personnel (Drivers, Helpers, Encoders). """
    employee_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    status = models.CharField(
        max_length=15,
        choices=EMPLOYEE_STATUS_CHOICES,
        default='Available'
    )
    license_number = models.CharField(max_length=50, blank=True, null=True)
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=5.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)]
    )
    image_url = models.URLField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

class Customer(models.Model):
    """ Details of clients and consignees. """
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=200)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Location(models.Model):
    """ Stores all geographic points (hubs, customer sites) for trips. """
    location_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    is_hub = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Truck(models.Model):
    """ Details about the vehicles in the fleet. """
    truck_id = models.AutoField(primary_key=True)
    license_plate = models.CharField(max_length=20, unique=True)
    vin = models.CharField(max_length=50, unique=True, blank=True, null=True)
    tonner_capacity = models.SmallIntegerField()
    status = models.CharField(
        max_length=15,
        choices=TRUCK_STATUS_CHOICES,
        default='Available'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.license_plate


# ====================================================================
# 3. TRIP SCHEDULING & MONITORING MODELS
# ====================================================================

class Trip(models.Model):
    """ A single scheduled/completed trip. """
    trip_id = models.AutoField(primary_key=True)
    trip_code = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.RESTRICT, related_name='trips')
    truck = models.ForeignKey(Truck, on_delete=models.RESTRICT, related_name='trips')
    driver = models.ForeignKey(
        Employee,
        on_delete=models.RESTRICT,
        related_name='driven_trips',
        limit_choices_to={'role': 'Driver'}
    )
    helper1 = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name='assisted_trips_h1',
        null=True, blank=True
    )
    helper2 = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name='assisted_trips_h2',
        null=True, blank=True
    )
    origin_location = models.ForeignKey(Location, on_delete=models.RESTRICT, related_name='origin_trips')
    destination_location = models.ForeignKey(Location, on_delete=models.RESTRICT, related_name='destination_trips')

    scheduled_start_time = models.DateTimeField()
    scheduled_end_time = models.DateTimeField(null=True, blank=True)
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_completion_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=TRIP_STATUS_CHOICES,
        default='Scheduled'
    )
    load_type = models.CharField(
        max_length=10,
        choices=LOAD_TYPE_CHOICES,
        null=True, blank=True
    )
    loading_ref_no = models.CharField(max_length=50, blank=True, null=True)
    net_weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cargo_type = models.CharField(max_length=100, default='General', help_text="e.g., Electronics, Pallets, Loose Cargo")

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='Low'
    )
    special_instructions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.trip_code

class TripEvent(models.Model):
    """ Detailed timestamps for operational logs (Loading/Unloading, etc.). """
    event_id = models.AutoField(primary_key=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='events')
    encoder = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name='encoded_events',
        null=True, blank=True,
        limit_choices_to={'role': 'Encoder'}
    )
    event_type = models.CharField(max_length=20, choices=TRIP_EVENT_TYPE_CHOICES)
    event_timestamp = models.DateTimeField(auto_now_add=True)
    location_lat = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    location_lon = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    document_no = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.trip.trip_code} - {self.event_type}"

class TripFuelLog(models.Model):
    """ Logs for fuel transactions. """
    fuel_id = models.AutoField(primary_key=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='fuel_logs')
    encoder = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name='encoded_fuel_logs',
        null=True, blank=True,
        limit_choices_to={'role': 'Encoder'}
    )
    fuel_ref_no = models.CharField(max_length=50)
    liters = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    fueling_location = models.ForeignKey(
        Location,
        on_delete=models.RESTRICT,
        related_name='fuel_logs',
        null=True, blank=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Fuel Log {self.fuel_ref_no}"