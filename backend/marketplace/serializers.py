from rest_framework import serializers
from .models import SkillTag, Project, Proposal

class SkillTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTag
        fields = ["id","name","kind"]

class ProjectSerializer(serializers.ModelSerializer):
    tags = SkillTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(many=True, write_only=True, queryset=SkillTag.objects.all(), source="tags")
    class Meta:
        model = Project
        fields = ["id","owner","title","description","status","budget_min","budget_max","looking_for_role","tags","tag_ids","created_at"]
        read_only_fields = ["owner","created_at"]
    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)

class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ["id","project","submitter","cover_letter","status","created_at"]
        read_only_fields = ["submitter","status","created_at"]
    def create(self, validated_data):
        validated_data["submitter"] = self.context["request"].user
        return super().create(validated_data)
