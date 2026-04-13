from rest_framework import serializers
from .models import Workshop, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']


class WorkshopListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    available_seats = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    tag_list = serializers.ReadOnlyField()
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Workshop
        fields = [
            'id', 'title', 'description', 'category', 'instructor_name',
            'level', 'level_display', 'status', 'status_display',
            'start_date', 'end_date', 'location', 'city', 'is_online',
            'max_participants', 'available_seats', 'is_full',
            'price', 'tag_list', 'created_at',
        ]


class WorkshopDetailSerializer(WorkshopListSerializer):
    class Meta(WorkshopListSerializer.Meta):
        fields = WorkshopListSerializer.Meta.fields + ['instructor_bio', 'updated_at']
