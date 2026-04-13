from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Booking
from .serializers import BookingCreateSerializer, BookingResponseSerializer


class BookingCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            response_serializer = BookingResponseSerializer(booking)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingLookupView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get('code', '').strip().upper()
        email = request.query_params.get('email', '').strip().lower()
        if not code or not email:
            return Response({'detail': 'code and email are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            booking = Booking.objects.select_related('workshop').get(
                confirmation_code=code, email__iexact=email
            )
            return Response(BookingResponseSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'detail': 'No booking found with those details.'}, status=status.HTTP_404_NOT_FOUND)
