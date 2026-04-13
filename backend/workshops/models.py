from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, default='🎓')

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Workshop(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='workshops')
    instructor_name = models.CharField(max_length=150)
    instructor_bio = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=200)
    city = models.CharField(max_length=100, blank=True)
    is_online = models.BooleanField(default=False)
    max_participants = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    tags = models.CharField(max_length=300, blank=True, help_text='Comma-separated tags')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title

    @property
    def available_seats(self):
        booked = self.bookings.filter(status='confirmed').count()
        return max(0, self.max_participants - booked)

    @property
    def is_full(self):
        return self.available_seats == 0

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(',') if t.strip()]
