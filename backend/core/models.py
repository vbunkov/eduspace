from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Студент'),
        ('author', 'Автор'),
        ('admin', 'Администратор'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    syllabus = models.TextField(help_text="Программа курса (текст или JSON)")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    material_file = models.FileField(upload_to='course_materials/', blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Order(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Оплачен'),
        ('pending', 'В ожидании'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='paid')
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='order_items')
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)


class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    text = models.TextField()
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
