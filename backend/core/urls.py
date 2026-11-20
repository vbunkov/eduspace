from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ProfileView, AuthorDetailView, CourseViewSet,
    CategoryListView, OrderCreateView, MyOrdersView,
    CourseReviewListCreateView, ModerationView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    # Auth и Профили (1-5)
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/', ProfileView.as_view(), name='user-profile'),
    path('authors/<int:pk>/', AuthorDetailView.as_view(), name='author-detail'),

    # Курсы и Категории (6-11 + 14)
    path('', include(router.urls)),
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # Заказы (12-13)
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/my/', MyOrdersView.as_view(), name='order-my'),

    # Отзывы и Модерация (15-17)
    path('courses/<int:course_id>/reviews/', CourseReviewListCreateView.as_view(), name='course-reviews'),
    path('moderation/<str:item_type>/<int:pk>/', ModerationView.as_view(), name='moderation'),
]