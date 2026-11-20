from rest_framework import serializers
from django.db.models import Avg
from .models import CustomUser, Category, Course, Order, OrderItem, Review

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'role', 'bio')

    def create(self, validated_data):
        role = validated_data.get('role', 'student')
        if role == 'admin':
            role = 'student'
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            bio=validated_data.get('bio', '')
        )

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'bio', 'date_joined')
        read_only_fields = ('id', 'role', 'date_joined')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')

class CourseSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    avg_rating = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'description', 'syllabus', 'price',
            'material_file', 'author', 'author_name', 'category',
            'category_name', 'avg_rating', 'is_active', 'created_at'
        )
        read_only_fields = ('author', 'is_active', 'created_at')
        extra_kwargs = {'material_file': {'write_only': True}}

    def get_avg_rating(self, obj):
        avg = obj.reviews.filter(is_hidden=False).aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

class AuthorPublicSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'bio', 'date_joined', 'courses')

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'course', 'user', 'user_name', 'rating', 'text', 'is_hidden', 'created_at')
        read_only_fields = ('course', 'user', 'is_hidden', 'created_at')

class OrderItemSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'course', 'course_title', 'price_at_purchase')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    course_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'total_price', 'status', 'created_at', 'items', 'course_ids')
        read_only_fields = ('user', 'total_price', 'status', 'created_at')

    def create(self, validated_data):
        course_ids = validated_data.pop('course_ids', [])
        courses = Course.objects.filter(id__in=course_ids, is_active=True)
        total = sum(c.price for c in courses)
        order = Order.objects.create(user=self.context['request'].user, total_price=total, status='paid')
        for course in courses:
            OrderItem.objects.create(order=order, course=course, price_at_purchase=course.price)
        return order