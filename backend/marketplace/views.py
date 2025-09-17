from rest_framework import viewsets, permissions, filters
from django.db import models
from .models import SkillTag, Project, Proposal
from .serializers import SkillTagSerializer, ProjectSerializer, ProposalSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS: return True
        owner = getattr(obj, "owner", getattr(obj, "submitter", None))
        return owner == request.user

class SkillTagViewSet(viewsets.ModelViewSet):
    queryset = SkillTag.objects.all().order_by("name")
    serializer_class = SkillTagSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name","kind"]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title","description","looking_for_role","tags__name"]

class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all().order_by("-created_at")
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs.filter(models.Q(submitter=self.request.user) | models.Q(project__owner=self.request.user)).distinct()
        return qs.none()
