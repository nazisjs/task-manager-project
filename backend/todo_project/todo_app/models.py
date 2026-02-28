from django.db import models
from django.contrib.auth.models import User



class Task(models.Model):

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    completed = models.BooleanField(default=False)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title



class Course(models.Model):

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title



    def progress_percent(self):

        total = self.checklist_set.count()

        completed = self.checklist_set.filter(
            completed=True
        ).count()

        if total == 0:
            return 0

        return int((completed / total) * 100)




class Checklist(models.Model):

    title = models.CharField(max_length=255)

    completed = models.BooleanField(default=False)

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title