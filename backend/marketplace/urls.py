from rest_framework.routers import DefaultRouter
from .views import SkillTagViewSet, ProjectViewSet, ProposalViewSet
router = DefaultRouter()
router.register(r"skills", SkillTagViewSet)
router.register(r"projects", ProjectViewSet)
router.register(r"proposals", ProposalViewSet)
urlpatterns = router.urls
