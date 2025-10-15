from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [("DEV","Developer"),("DES","Designer"),("BOTH","Both")]
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default="BOTH")

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    portfolio_url = models.URLField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    availability = models.CharField(max_length=80, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    def __str__(self): return self.display_name or self.user.username


class Work(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="works")
    title = models.CharField(max_length=120)
    image = models.ImageField(upload_to="works/")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.user.username} · {self.title}"
