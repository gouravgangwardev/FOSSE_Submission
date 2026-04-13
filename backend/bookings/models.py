from django.db import models
from workshops.models import Workshop


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('waitlisted', 'Waitlisted'),
    ]

    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, related_name='bookings')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    organization = models.CharField(max_length=200, blank=True)
    experience_level = models.CharField(max_length=50, blank=True)
    special_requirements = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confirmation_code = models.CharField(max_length=12, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = [['workshop', 'email']]

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.workshop.title}"

    def save(self, *args, **kwargs):
        if not self.confirmation_code:
            import uuid
            self.confirmation_code = uuid.uuid4().hex[:10].upper()
        if not self.pk:
            # Auto-confirm if seats available, else waitlist
            if self.workshop.is_full:
                self.status = 'waitlisted'
            else:
                self.status = 'confirmed'
        super().save(*args, **kwargs)
