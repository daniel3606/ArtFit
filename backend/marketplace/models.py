from django.db import models
from django.conf import settings

class SkillTag(models.Model):
    KIND_CHOICES = [("ROLE","Role"),("TOOL","Tool"),("STYLE","Style"),("GENRE","Genre")]
    name = models.CharField(max_length=64, unique=True)
    kind = models.CharField(max_length=8, choices=KIND_CHOICES, default="TOOL")
    def __str__(self): return self.name

class Project(models.Model):
    STATUS = [("OPEN","Open"),("CLOSED","Closed")]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=120)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS, default="OPEN")
    budget_min = models.IntegerField(null=True, blank=True)
    budget_max = models.IntegerField(null=True, blank=True)
    tags = models.ManyToManyField(SkillTag, blank=True, related_name="projects")
    looking_for_role = models.CharField(max_length=8, choices=[("DEV","Developer"),("DES","Designer"),("BOTH","Both")], default="BOTH")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.title

class Proposal(models.Model):
    STATUS = [("PENDING","Pending"),("ACCEPTED","Accepted"),("REJECTED","Rejected")]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="proposals")
    submitter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="proposals")
    cover_letter = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ("project","submitter")
    def __str__(self): return f"{self.submitter} -> {self.project}"
