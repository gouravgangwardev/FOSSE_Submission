from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.BookingCreateView.as_view(), name='booking-create'),
    path('booking/lookup/', views.BookingLookupView.as_view(), name='booking-lookup'),
]
