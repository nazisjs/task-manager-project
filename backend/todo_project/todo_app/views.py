# Create your views here.
from rest_framework import viewsets,permissions
from .models import Task,Course,Checklist
from .serializers import TaskSerializer,CourseSerializer,ChecklistSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class=TaskSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class=CourseSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(owner=self.request.user)
    
    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

class ChecklistViewSet(viewsets.ModelViewSet):
    serializer_class=ChecklistSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Checklist.objects.filter(course__owner=self.request.user)