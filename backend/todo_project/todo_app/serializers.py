from rest_framework import serializers
from .models import Task,Course,Checklist

class TaskSerializer(serializers.ModelSerializer):
    owner=serializers.StringRelatedField(read_only=True)
    class Meta:
        model=Task
        fields=['id','title','description','completed','owner','created_at']
        read_only_fields=['id','created_at']

class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model=Checklist
        fields=['id','title','completed','course']
        read_only_fields=['id']

class CourseSerializer(serializers.ModelSerializer):
    owner=serializers.StringRelatedField(read_only=True)
    checklists=ChecklistSerializer(
        source='checklist_set',
        many=True,
        read_only=True
    )
    
    progress_percent=serializers.SerializerMethodField()
    class Meta:
        model=Course
        fields=['id','title','description','owner','checklists','progress_percent']
        read_only_fields=['id']
    
    def get_progress_percent(self,obj):
        return obj.progress_percent()