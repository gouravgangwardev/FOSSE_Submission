from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'workshop', 'status', 'confirmation_code', 'created_at']
    list_filter = ['status', 'workshop__category']
    search_fields = ['first_name', 'last_name', 'email', 'confirmation_code']
    readonly_fields = ['confirmation_code', 'created_at']
