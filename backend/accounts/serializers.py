from rest_framework import serializers
from .models import User, Profile, Work

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["display_name","bio","location","portfolio_url","hourly_rate","availability","avatar"]

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    works = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id","username","email","role","first_name","last_name","profile","works"]
    def get_profile(self, obj):
        try:
            p = Profile.objects.filter(user=obj).first()
            if not p:
                return None
            return ProfileSerializer(p).data
        except Exception:
            # In case the Profile table doesn't exist yet or other DB errors
            return None
    def get_works(self, obj):
        return [
            {"id": w.id, "title": w.title, "image": w.image.url if w.image else None, "created_at": w.created_at}
            for w in Work.objects.filter(user=obj).order_by("-created_at")
        ]

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["display_name","bio","location","portfolio_url","hourly_rate","availability","avatar"]

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = ["id","title","image","created_at"]
        read_only_fields = ["id","created_at"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username","email","password","role"]
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # Profile is auto-created by signal, no need to create here
        return user
