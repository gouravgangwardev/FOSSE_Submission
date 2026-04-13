from django.contrib import admin
from .models import Workshop, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'instructor_name', 'level', 'status', 'start_date', 'available_seats']
    list_filter = ['status', 'level', 'category', 'is_online']
    search_fields = ['title', 'instructor_name', 'city']
    readonly_fields = ['created_at', 'updated_at']
