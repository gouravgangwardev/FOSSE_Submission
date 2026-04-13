from django.urls import path
from . import views

urlpatterns = [
    path('workshops/', views.WorkshopListView.as_view(), name='workshop-list'),
    path('workshops/<int:pk>/', views.WorkshopDetailView.as_view(), name='workshop-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
]
