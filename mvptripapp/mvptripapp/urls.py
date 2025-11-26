from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints for the fleet application
    path('api/', include('fleet.urls')), 
]