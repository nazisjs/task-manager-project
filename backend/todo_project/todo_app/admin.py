# Register your models here.
from django.contrib import admin
from .models import Task, Course, Checklist, UserProfile

admin.site.register(Task)
admin.site.register(Course)
admin.site.register(Checklist)
admin.site.register(UserProfile)