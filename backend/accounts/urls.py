from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MeView, ProfileUpdateView, WorkViewSet

router = DefaultRouter()
router.register(r"works", WorkViewSet, basename="works")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", ProfileUpdateView.as_view(), name="profile-update"),
    path("", include(router.urls)),
]
