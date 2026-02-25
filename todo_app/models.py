from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    completed=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    owner=models.ForeignKey(User,on_delete=models.CASCADE)

class Course(models.Model):
    title=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    start_date=models.DateField(null=True,blank=True)
    end_date=models.DateField(null=True,blank=True)
    difficulty=models.CharField(max_length=50,blank=True)

    def __str__(self):
        return self.title

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)  # 0-100%
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'course')