from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Task, Course, Checklist, UserProfile
from .serializers import TaskSerializer, CourseSerializer, ChecklistSerializer
from django.utils import timezone


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response(
                {'error': 'Username, email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            return Response(
                {
                    'message': 'User created successfully',
                    'username': user.username,
                    'email': user.email
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'bio': profile.bio,
        })

    if request.method == 'PATCH':
        new_username = request.data.get('username', '').strip()
        display_name = request.data.get('display_name', '').strip()
        email = request.data.get('email', '').strip()
        bio = request.data.get('bio', '').strip()

    if new_username and new_username != user.username:
        if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
            return Response({'detail': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        user.username = new_username

    if display_name:
        parts = display_name.split(' ', 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ''

    if email and email != user.email:
        if User.objects.filter(email=email).exclude(pk=user.pk).exists():
            return Response({'detail': 'Email already in use.'}, status=status.HTTP_400_BAD_REQUEST)
        user.email = email

    profile.bio = bio
    user.save()
    profile.save()

    return Response({
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'bio': profile.bio,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response({'detail': 'Both old and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(old_password):
        return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 8:
        return Response({'detail': 'New password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(user)
    return Response({
        'detail': 'Password changed successfully.',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistics(request):
    user=request.user
    total_courses=Course.objects.filter(owner=user).count()
    completed_courses=Course.objects.filter(owner=user,status='completed').count()
    total_checklists=Checklist.objects.filter(course__owner=user).count()
    completed_checklists=Checklist.objects.filter(course__owner=user,completed=True).count()
    total_daily_tasks=Task.objects.filter(owner=user).count()
    total_completed_daily_tasks=Task.objects.filter(owner=user,status='completed').count()

    from datetime import date, timedelta
    completed_dates = set(
        Task.objects.filter(owner=user, status='completed', completed_at__isnull=False)
        .values_list('completed_at__date', flat=True)
    )
    streak = 0
    today = date.today()
    current = today if today in completed_dates else today - timedelta(days=1)
    while current in completed_dates:
        streak += 1
        current -= timedelta(days=1)
    return Response({
        'total_courses':total_courses,
        'completed_courses':completed_courses,
        'total_checklists':total_checklists,
        'completed_checklists':completed_checklists,
        'streak_days':streak,
        'total_daily_tasks':total_daily_tasks,
        'total_completed_daily_tasks':total_completed_daily_tasks,
    })


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.data.get('status') == 'completed' and instance.status != 'completed':
            instance.completed_at = timezone.now()
            instance.save()
        return super().partial_update(request, *args, **kwargs)

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ChecklistViewSet(viewsets.ModelViewSet):
    serializer_class = ChecklistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Checklist.objects.filter(course__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save()