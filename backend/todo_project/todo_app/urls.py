from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views

router=DefaultRouter()
router.register(r'tasks',      views.TaskViewSet,      basename='task')
router.register(r'courses',    views.CourseViewSet,    basename='course')
router.register(r'checklists', views.ChecklistViewSet, basename='checklist')

urlpatterns = [path('', include(router.urls))]