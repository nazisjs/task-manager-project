from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tasks',views.TaskViewSet,basename='task')
router.register(r'courses',views.CourseViewSet,basename='course')
router.register(r'checklists',views.ChecklistViewSet,basename='checklist')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view()),     
    path('api/token/refresh/', TokenRefreshView.as_view()), 
    path('api/register/', views.register),
    path('api/statistics/',views.statistics ),
    path('api/user/', views.current_user),
    path('api/change-password/',views.change_password),
]