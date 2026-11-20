from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomUser, Category, Course, Order, OrderItem, Review
from .serializers import (
    RegisterSerializer, UserProfileSerializer, AuthorPublicSerializer,
    CategorySerializer, CourseSerializer, OrderSerializer, ReviewSerializer
)
from .permissions import IsAuthorRole, IsCourseAuthorOrAdmin, IsCourseBuyer, IsModeratorAdmin

# 1. Регистрация
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

# 4. Профиль текущего пользователя
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# 5. Публичный профиль автора
class AuthorDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.filter(role__in=('author', 'admin'))
    serializer_class = AuthorPublicSerializer

# 6-10, 14. Курсы и защищенное скачивание материалов
class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    filterset_fields = ['category', 'author']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return Course.objects.all().order_by('-created_at')
        return Course.objects.filter(is_active=True).order_by('-created_at')

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthorRole()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsCourseAuthorOrAdmin()]
        if self.action == 'materials':
            return [IsCourseBuyer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # 14. Защищенный эндпоинт скачивания архива курса
    @action(detail=True, methods=['get'], url_path='materials')
    def materials(self, request, pk=None):
        course = self.get_object()
        if not course.material_file:
            return Response({'detail': 'Материалы к курсу еще не загружены.'}, status=status.HTTP_404_NOT_FOUND)
        return FileResponse(course.material_file.open('rb'), as_attachment=True)

# 11. Категории
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

# 12-13. Заказы
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

# 15-16. Отзывы к курсу
class CourseReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(course_id=self.kwargs['course_id'], is_hidden=False).order_by('-created_at')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        course = get_object_or_404(Course, id=self.kwargs['course_id'])
        has_bought = OrderItem.objects.filter(
            order__user=self.request.user, order__status='paid', course=course
        ).exists()
        if not has_bought:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Оставлять отзывы могут только студенты, купившие этот курс.")
        serializer.save(user=self.request.user, course=course)

# 17. Модерация курсов и отзывов
class ModerationView(APIView):
    permission_classes = [IsModeratorAdmin]

    def patch(self, request, item_type, pk):
        if item_type == 'course':
            obj = get_object_or_404(Course, pk=pk)
            obj.is_active = not obj.is_active
            obj.save()
            return Response({'id': obj.id, 'is_active': obj.is_active})
        elif item_type == 'review':
            obj = get_object_or_404(Review, pk=pk)
            obj.is_hidden = not obj.is_hidden
            obj.save()
            return Response({'id': obj.id, 'is_hidden': obj.is_hidden})
        return Response({'detail': 'Неверный тип объекта'}, status=status.HTTP_400_BAD_REQUEST)