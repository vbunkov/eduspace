from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Category, Course, Order, OrderItem, Review

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительно (EduSpace)', {'fields': ('role', 'bio')}),
    )

admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)