from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tasks',      views.TaskViewSet,      basename='task')
router.register(r'courses',    views.CourseViewSet,    basename='course')
router.register(r'checklists', views.ChecklistViewSet, basename='checklist')

urlpatterns = [
    path('', include(router.urls)),
    
    # ✅ JWT Токены
    path('api/token/', TokenObtainPairView.as_view()),      # Логин → получить токен
    path('api/token/refresh/', TokenRefreshView.as_view()), # Обновить токен
    
    # ✅ Регистрация
    path('api/register/', views.register),  # Регистрация нового пользователя
]