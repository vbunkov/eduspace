from rest_framework import permissions
from .models import OrderItem

class IsAuthorRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('author', 'admin')

class IsCourseAuthorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (obj.author == request.user or request.user.role == 'admin')

class IsCourseBuyer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if obj.author == request.user or request.user.role == 'admin':
            return True
        return OrderItem.objects.filter(
            order__user=request.user,
            order__status='paid',
            course=obj
        ).exists()

class IsModeratorAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'