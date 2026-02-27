from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task, Course, Checklist


# ─────────────────────────────────────────────────
# TASK TESTS
# ─────────────────────────────────────────────────
class TaskTests(APITestCase):

    def setUp(self):
        self.user  = User.objects.create_user(username='alice', password='pass123')
        self.other = User.objects.create_user(username='bob',   password='pass123')
        self.client.force_authenticate(user=self.user)

    def test_create_task(self):
        res = self.client.post('/api/tasks/', {'title': 'Buy groceries'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.first().owner, self.user)

    def test_list_only_own_tasks(self):
        # Alice creates 1 task, Bob creates 1 task
        Task.objects.create(title='Alice task', owner=self.user)
        Task.objects.create(title='Bob task',   owner=self.other)

        res = self.client.get('/api/tasks/')
        self.assertEqual(len(res.data), 1)          # Alice sees only hers
        self.assertEqual(res.data[0]['title'], 'Alice task')

    def test_mark_task_complete(self):
        task = Task.objects.create(title='Study DRF', owner=self.user)
        res = self.client.patch(f'/api/tasks/{task.id}/', {'completed': True})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertTrue(task.completed)

    def test_unauthenticated_blocked(self):
        self.client.logout()
        res = self.client.get('/api/tasks/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


# ─────────────────────────────────────────────────
# COURSE + CHECKLIST TESTS
# ─────────────────────────────────────────────────
class CourseTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='pass123')
        self.client.force_authenticate(user=self.user)

        self.course = Course.objects.create(title='Python Basics', owner=self.user)

        # 3 checklist items: 1 done, 2 not done
        self.item1 = Checklist.objects.create(title='Variables', course=self.course, completed=True)
        self.item2 = Checklist.objects.create(title='Functions', course=self.course, completed=False)
        self.item3 = Checklist.objects.create(title='Classes',   course=self.course, completed=False)

    def test_course_response_has_nested_checklists(self):
        res = self.client.get(f'/api/courses/{self.course.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('checklists', res.data)
        self.assertEqual(len(res.data['checklists']), 3)

    def test_progress_percent_correct(self):
        res = self.client.get(f'/api/courses/{self.course.id}/')
        # 1 of 3 completed → 33%
        self.assertEqual(res.data['progress_percent'], 33)

    def test_completing_item_updates_progress(self):
        # Mark item2 done → 2/3 = 66%
        self.client.patch(f'/api/checklists/{self.item2.id}/', {'completed': True})
        res = self.client.get(f'/api/courses/{self.course.id}/')
        self.assertEqual(res.data['progress_percent'], 66)

    def test_delete_course_cascades_checklists(self):
        self.client.delete(f'/api/courses/{self.course.id}/')
        # on_delete=CASCADE → all 3 checklist items should be gone
        self.assertEqual(Checklist.objects.count(), 0)

    def test_empty_course_progress_is_zero(self):
        empty = Course.objects.create(title='Empty', owner=self.user)
        res = self.client.get(f'/api/courses/{empty.id}/')
        self.assertEqual(res.data['progress_percent'], 0)