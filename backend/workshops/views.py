from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Workshop, Category
from .serializers import WorkshopListSerializer, WorkshopDetailSerializer, CategorySerializer


class WorkshopListView(generics.ListAPIView):
    queryset = Workshop.objects.select_related('category').all()
    serializer_class = WorkshopListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'instructor_name', 'city', 'tags']
    ordering_fields = ['start_date', 'price', 'title']
    ordering = ['-start_date']

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        level = self.request.query_params.get('level')
        category = self.request.query_params.get('category')
        is_online = self.request.query_params.get('is_online')

        if status:
            qs = qs.filter(status=status)
        if level:
            qs = qs.filter(level=level)
        if category:
            qs = qs.filter(category__slug=category)
        if is_online is not None:
            qs = qs.filter(is_online=is_online.lower() == 'true')
        return qs


class WorkshopDetailView(generics.RetrieveAPIView):
    queryset = Workshop.objects.select_related('category').all()
    serializer_class = WorkshopDetailSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
