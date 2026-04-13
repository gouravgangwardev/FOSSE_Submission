from rest_framework import serializers
from .models import Booking
from workshops.models import Workshop


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'workshop', 'first_name', 'last_name', 'email',
            'phone', 'organization', 'experience_level', 'special_requirements',
        ]

    def validate(self, data):
        workshop = data.get('workshop')
        email = data.get('email')
        if Booking.objects.filter(workshop=workshop, email=email).exists():
            raise serializers.ValidationError({
                'email': 'You have already booked this workshop with this email address.'
            })
        if workshop.status not in ('upcoming', 'ongoing'):
            raise serializers.ValidationError({'workshop': 'This workshop is not accepting bookings.'})
        return data


class BookingResponseSerializer(serializers.ModelSerializer):
    workshop_title = serializers.CharField(source='workshop.title', read_only=True)
    workshop_date = serializers.DateTimeField(source='workshop.start_date', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'workshop', 'workshop_title', 'workshop_date',
            'first_name', 'last_name', 'email', 'status', 'status_display',
            'confirmation_code', 'created_at',
        ]
