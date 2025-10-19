from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer, ProfileUpdateSerializer, WorkSerializer
from .models import User, Profile, Work
import os

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for automatic login
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

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


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    """
    Authenticate user with Google ID token from frontend.
    Frontend handles OAuth flow and sends us the ID token.
    """
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify the token with Google
        google_client_id = os.getenv('GOOGLE_CLIENT_ID')
        if not google_client_id:
            return Response({'error': 'Google OAuth not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            google_client_id
        )
        
        # Get user info from token
        email = idinfo.get('email')
        google_id = idinfo.get('sub')
        name = idinfo.get('name', '')
        given_name = idinfo.get('given_name', '')
        family_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture', '')
        
        if not email:
            return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0] + '_' + google_id[:8],
                'first_name': given_name,
                'last_name': family_name,
            }
        )
        
        # If user already exists with different auth method, update info
        if not created:
            user.first_name = given_name or user.first_name
            user.last_name = family_name or user.last_name
            user.save()
        
        # Ensure profile exists
        profile, _ = Profile.objects.get_or_create(user=user)
        if created and name:
            profile.display_name = name
            profile.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'is_new_user': created,
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        # Invalid token
        return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
