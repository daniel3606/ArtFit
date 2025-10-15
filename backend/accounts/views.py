from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import RegisterSerializer, UserSerializer, ProfileUpdateSerializer, WorkSerializer
from .models import Work

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self): return self.request.user

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def get_object(self): return self.request.user.profile

class WorkViewSet(viewsets.ModelViewSet):
    serializer_class = WorkSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def get_queryset(self):
        return Work.objects.filter(user=self.request.user).order_by('-created_at')
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
